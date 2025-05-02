import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@app/stores/rootStore';
import httpService from '@app/services/http.service';
import { toast } from 'react-toastify';
import { STOCK_ENDPOINTS, addQueryParams } from '@app/consts/apiEndpoints';

// Define types for stock data
export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow?: number;
  dayHigh?: number;
  yearHigh?: number;
  yearLow?: number;
  marketCap?: number;
  priceAvg50?: number;
  priceAvg200?: number;
  volume?: number;
  avgVolume?: number;
  timestamp?: number;
}

export interface StockDetails extends StockQuote {
  website?: string;
  description?: string;
  ceo?: string;
  industry?: string;
  sector?: string;
  pe?: number;
  eps?: number;
  beta?: number;
}

/**
 * MobX store for managing stock search and details
 */
export class StockStore {
  rootStore: RootStore;
  searchQuery = '';
  searchResults: StockSearchResult[] = [];
  isSearching = false;
  selectedStock: string | null = null;
  stockDetails: StockDetails | null = null;
  isLoadingDetails = false;
  // Track ongoing API requests by symbol
  private requestsInProgress = new Map<string, boolean>();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  searchStocks = async () => {
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      toast.error('Search term must be at least 2 characters long');
      return;
    }

    try {
      this.isSearching = true;
      const searchUrl = addQueryParams(STOCK_ENDPOINTS.SEARCH, {
        query: this.searchQuery,
      });

      const response = await httpService.get<{ results: StockSearchResult[] }>(
        searchUrl
      );

      runInAction(() => {
        this.searchResults = response.results;
        this.isSearching = false;
      });

      // Show message if no results
      if (response.results.length === 0) {
        toast.info('No matching stocks found');
      }
    } catch (error) {
      runInAction(() => {
        this.isSearching = false;
        this.searchResults = [];
      });
      toast.error('Error searching for stocks');
      console.error('Error searching stocks:', error);
    }
  };

  clearSearch = () => {
    console.log('clearSearch');
    this.searchQuery = '';
    this.searchResults = [];
  };

  selectStock = (symbol: string) => {
    this.selectedStock = symbol;
  };

  getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
    try {
      return await httpService.get<StockQuote>(STOCK_ENDPOINTS.QUOTE(symbol));
    } catch (error) {
      toast.error(`Error getting quote for ${symbol}`);
      console.error(`Error getting quote for ${symbol}:`, error);
      return null;
    }
  };

  getStockDetails = async (symbol: string) => {
    // Check if a request is already in progress for this symbol
    const endpoint = STOCK_ENDPOINTS.DETAILS(symbol);
    if (this.requestsInProgress.get(endpoint)) {
      return this.stockDetails;
    }

    try {
      this.isLoadingDetails = true;
      this.requestsInProgress.set(endpoint, true);

      const details = await httpService.get<StockDetails>(endpoint);

      runInAction(() => {
        this.stockDetails = details;
        this.isLoadingDetails = false;
        this.requestsInProgress.set(endpoint, false);
      });

      return details;
    } catch (error) {
      runInAction(() => {
        this.stockDetails = null;
        this.isLoadingDetails = false;
        this.requestsInProgress.set(endpoint, false);
      });
      toast.error(`Error getting details for ${symbol}`);
      console.error(`Error getting details for ${symbol}:`, error);
      return null;
    }
  };

  get hasSearchResults() {
    return this.searchResults.length > 0;
  }
}
