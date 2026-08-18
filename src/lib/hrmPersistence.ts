export const HRMEventEmitter = new EventTarget();

export function notifyHRM() {
  if (typeof window !== 'undefined') {
    HRMEventEmitter.dispatchEvent(new Event('hrm-update'));
  }
}
