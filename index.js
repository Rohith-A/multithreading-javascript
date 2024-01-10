const { Worker } = require('worker_threads');
const jobs = Array.from({ length: 100 }, () => 1e9);


const chunkify = (arr, nodes) => {
    let chunks = [];
    for (let i = nodes; i > 0; i--) {
        chunks.push(arr.splice(0, Math.ceil(arr.length / i)));
    }
    return chunks;
}
function run(jobs, concurrentWorkers) {
    const tick = performance.now();
    let completedWorkers = 0;
    const chunks = chunkify(jobs, concurrentWorkers);
    chunks.forEach((data, i) => {
        const worker = new Worker('./parallel.js');
        worker.postMessage(data);
        worker.on('message', () => {
            console.log(`Worker ${i} completed`);
            completedWorkers++;
            if (completedWorkers === concurrentWorkers) {
                console.log(`${concurrentWorkers} workers took ${performance.now()}`);
                process.exit();
            }
        });
    });
};

run(jobs, 8);