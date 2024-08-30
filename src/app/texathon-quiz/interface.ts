interface Navigator {
    keyboard: {
      lock: () => Promise<void>;
      unlock: () => void;
    };
  }