/**
 * undici@7（fastmcp 依赖）在加载时会访问全局 File；Node 18 无全局 File，Node 20+ 有。
 * 必须在任何会间接加载 undici 的 import 之前执行。
 */
import { File } from 'node:buffer';

if (typeof globalThis.File === 'undefined') {
  // buffer.File 与 DOM File 类型定义略有差异，运行时满足 undici 对全局 File 的断言即可
  (globalThis as unknown as { File: typeof File }).File = File;
}
