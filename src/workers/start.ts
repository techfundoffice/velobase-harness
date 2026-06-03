/**
 * Worker Service Starter
 *
 * Exports `startWorker()` which can be called either:
 *  - from `src/workers/index.ts` (standalone worker process)
 *  - from `src/server/standalone.ts` when SERVICE_MODE includes worker/all
 *
 * Returns a `shutdown` function for graceful termination.
 */
import {
  collectDisabledSchedulerContributions,
  collectEnabledWorkerContributions,
  MODULE_STATES,
} from "@/config/modules";
import { createLogger } from "@/lib/logger";
import { WorkerRegistry } from "./registry";
import { createServer } from "./server";
import { getPlatformWorkerContributions } from "./platform";

const log = createLogger("worker");

const DEFAULT_WORKER_PORT = 3001;

export interface WorkerHandle {
  registry: WorkerRegistry;
  shutdown: () => Promise<void>;
}

export async function startWorker(): Promise<WorkerHandle> {
  const port = parseInt(
    process.env.WORKER_PORT ?? String(DEFAULT_WORKER_PORT),
    10,
  );

  const registry = new WorkerRegistry();

  registry.registerContributions(getPlatformWorkerContributions());

  const moduleWorkerContributions = await collectEnabledWorkerContributions();
  const disabledSchedulers = await collectDisabledSchedulerContributions();
  registry.registerContributions(moduleWorkerContributions);

  const server = await createServer(registry.getQueues());
  await registry.startAll(disabledSchedulers);
  await server.listen({ port, host: "0.0.0.0" });

  log.info(
    {
      modules: MODULE_STATES.map((state) => ({
        id: state.id,
        mode: state.mode,
        enabled: state.enabled,
        reason: state.reason,
      })),
    },
    "Module states resolved",
  );
  log.info({ port }, `Worker ready - HTTP server listening on port ${port}`);
  log.info("Bull Board UI: /_worker/queues");
  log.info("Health check: /health");

  const shutdown = async () => {
    await registry.shutdown();
    await server.close();
    log.info("Worker HTTP server closed");
  };

  return { registry, shutdown };
}
