import { makeAutoObservable } from 'mobx';
import { StockStore } from '@app/stores/stockStore';
import { PortfolioStore } from '@app/stores/portfolioStore';

/**
 * Root store that coordinates all application stores
 */
export class RootStore {
  stockStore: StockStore;
  portfolioStore: PortfolioStore;

  constructor() {
    // Create the child stores with reference to the root store
    this.stockStore = new StockStore(this);
    this.portfolioStore = new PortfolioStore(this);

    makeAutoObservable(this);
  }
}
