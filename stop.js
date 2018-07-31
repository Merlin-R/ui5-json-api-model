try {
  const pid = +require('fs').readFileSync('./.process.pid').toString().trim();
  process.kill( pid, "SIGINT" );
} catch ( e ) {}
