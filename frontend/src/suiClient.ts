import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { NETWORK } from './constants';

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
