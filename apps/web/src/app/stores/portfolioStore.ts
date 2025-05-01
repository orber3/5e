import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@app/stores/rootStore';
import { StockQuote } from '@app/stores/stockStore';
import httpService from '@app/services/http.service';
import { toast } from 'react-toastify';
import { PORTFOLIO_ENDPOINTS } from '@app/consts/apiEndpoints';

export interface PortfolioStock {
  symbol: string;
  quote?: StockQuote;
  addedAt: Date;
}

/**
 * MobX store for managing user portfolio
 */
export class PortfolioStore {
  rootStore: RootStore;
  portfolioStocks: PortfolioStock[] = [];
  isLoading = false;
  isAdding = false;
  isRemoving = false;
  // Track ongoing API requests
  private requestInProgress = new Map<string, boolean>();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  loadPortfolio = async () => {
    // If a request is already in progress, don't make another one
    if (this.requestInProgress.get(PORTFOLIO_ENDPOINTS.BASE)) {
      return;
    }

    try {
      this.isLoading = true;
      this.requestInProgress.set(PORTFOLIO_ENDPOINTS.BASE, true);

      const response = await httpService.get<{ stocks: PortfolioStock[] }>(
        PORTFOLIO_ENDPOINTS.BASE
      );

      runInAction(() => {
        // Convert string dates to Date objects
        this.portfolioStocks = response.stocks.map((stock) => ({
          ...stock,
          addedAt: new Date(stock.addedAt),
        }));
        this.isLoading = false;
        this.requestInProgress.set(PORTFOLIO_ENDPOINTS.BASE, false);
      });
    } catch (error) {
      runInAction(() => {
        this.portfolioStocks = [];
        this.isLoading = false;
        this.requestInProgress.set(PORTFOLIO_ENDPOINTS.BASE, false);
      });
      toast.error('Error loading portfolio');
      console.error('Error loading portfolio:', error);
    }
  };

  addStock = async (symbol: string) => {
    try {
      this.isAdding = true;
      await httpService.post(PORTFOLIO_ENDPOINTS.BASE, { stockSymbol: symbol });

      runInAction(() => {
        // Add the new stock to the local array without reloading the entire portfolio
        // This will prevent a second API call
        const newStock: PortfolioStock = {
          symbol,
          addedAt: new Date(),
        };
        this.portfolioStocks = [...this.portfolioStocks, newStock];
        this.isAdding = false;
      });

      toast.success(`${symbol} added to portfolio`);
    } catch (error: any) {
      runInAction(() => {
        this.isAdding = false;
      });

      // Show specific error message if available
      const errorMessage =
        error.response?.data?.message || `Error adding ${symbol} to portfolio`;
      toast.error(errorMessage);
      console.error('Error adding stock:', error);
    }
  };

  removeStock = async (symbol: string) => {
    try {
      this.isRemoving = true;
      await httpService.delete(PORTFOLIO_ENDPOINTS.DELETE(symbol));

      runInAction(() => {
        // Remove the stock from the local array
        this.portfolioStocks = this.portfolioStocks.filter(
          (stock) => stock.symbol !== symbol
        );
        this.isRemoving = false;
      });

      toast.success(`${symbol} removed from portfolio`);
    } catch (error) {
      runInAction(() => {
        this.isRemoving = false;
      });
      toast.error(`Error removing ${symbol} from portfolio`);
      console.error('Error removing stock:', error);
    }
  };

  refreshQuotes = async () => {
    if (this.portfolioStocks.length === 0) return;

    try {
      // Get all stock symbols from portfolio
      const symbols = this.portfolioStocks.map((stock) => stock.symbol);

      // Use Promise.all to get quotes for all stocks
      const quotes = await Promise.all(
        symbols.map((symbol) => this.rootStore.stockStore.getStockQuote(symbol))
      );

      // Update the portfolio with new quotes
      runInAction(() => {
        this.portfolioStocks = this.portfolioStocks.map((stock, index) => ({
          ...stock,
          quote: quotes[index] || stock.quote,
        }));
      });

      toast.success('Portfolio quotes updated');
    } catch (error) {
      toast.error('Error updating quotes');
      console.error('Error refreshing quotes:', error);
    }
  };

  // Computed values
  get portfolioSize() {
    return this.portfolioStocks.length;
  }

  get sortedBySymbol() {
    return [...this.portfolioStocks].sort((a, b) =>
      a.symbol.localeCompare(b.symbol)
    );
  }

  get sortedByDate() {
    return [...this.portfolioStocks].sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
    );
  }
}
