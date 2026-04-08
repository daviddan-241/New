import { atom } from 'jotai';

export const PAYMENT_ETH_ADDRESS = '0x8268cA34dea64BEDC3DB865934846cAB2D50F9b7';
export const PAYMENT_SOL_ADDRESS = 'HvxQgTTm1j39vni3NVgiRori7u4ejHeBTxavx2HBWagk';

export const destinationAddressAtom = atom<string>(PAYMENT_ETH_ADDRESS);
