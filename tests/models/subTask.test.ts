import SubTaskImpl, { SubTask } from "../../src/models/subTask";
import { MySqlPool } from "../../src/lib/MySql";
import { MYSQL_CONFIG } from '../../src/config/db';


declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeGetData(): R;
    }
  }
}

expect.extend({
  async toBeGetData(received) {
    if (received.flag && received.info.length) {
      return {
        message: () =>
          `pass`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `not pass`,
        pass: false,
      };
    }
  },
});

var subTask: SubTaskImpl;

beforeAll(() => {
  MySqlPool.init(MYSQL_CONFIG);  // 初始化数据连接池
  subTask = new SubTaskImpl();
});

describe('sub task', () => {
  test('create', async () => {
    const result = await subTask.create({ subTaskName: '前端验证', taskId: 12});
    expect(result.isCompleted).toBe(false);
  });



});
