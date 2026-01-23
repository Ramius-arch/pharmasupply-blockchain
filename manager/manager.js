import { exec } from 'child_process';

const services = [
  {
    name: 'hardhat',
    command: 'npx hardhat node',
    cwd: './web3',
  },
  {
    name: 'backend',
    command: 'npm start',
    cwd: './backend',
  },
  {
    name: 'frontend',
    command: 'npm run dev',
    cwd: './frontend',
  },
];

const main = () => {
  services.forEach(service => {
    const process = exec(service.command, { cwd: service.cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[${service.name}] error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[${service.name}] stderr: ${stderr}`);
        return;
      }
      console.log(`[${service.name}] stdout: ${stdout}`);
    });

    process.stdout.on('data', (data) => {
      console.log(`[${service.name}] ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`[${service.name}] ${data}`);
    });
  });
};

main();
