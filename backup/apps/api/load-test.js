import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,
  duration: '10s',
};

export default function () {
  const res = http.get('http://localhost:4000/api/themes');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(0.1);
}
