import { setLoadingState } from "../storeActions";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier: string = "global") {
  return (originMethod: any, _context: any): any => {
    return async (...args: any) => {
      console.info(555555555);
      setLoadingState({
        identifier,
        show: true,
      });
      try {
        return await originMethod(...args);
      } finally {
        setLoadingState({
          identifier,
          show: false,
        });
      }
    };
  };
}
