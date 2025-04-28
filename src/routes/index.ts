import HomePage from '../Pages/HomePage/HomePage';
import SwapPage from '../Pages/SwapPage/SwapPage';
import LiquidityPage from '../Pages/LiquidityPage/LiquidityPage';
import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import MintPage from "../Pages/MintPage/MintPage";

interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  isPrivate?: boolean;
  name: string;
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    exact: true,
    name: 'Home',
  },
  {
    path: '/swap',
    component: SwapPage,
    name: 'Swap',
  },
  {
    path: '/liquidity',
    component: LiquidityPage,
    name: 'Liquidity',
  },
  {
    path: '/profile',
    component: ProfilePage,
    isPrivate: true,
    name: 'Profile',
  },
  {
    path: '/mint',
    component: MintPage ,
    name: 'Mint',
},
];

export default routes;
