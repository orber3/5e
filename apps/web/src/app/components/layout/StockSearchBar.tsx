import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Dropdown, Space, List, Typography } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores/storeContext';
import { getStockDetailsRoute } from '@app/routes';
import { StockSearchResult } from '@app/stores/stockStore';
import { STOCK_SEARCH } from '@app/consts/strings';
import useDebounce from '@app/hooks/useDebounce';

const { Text } = Typography;

const StockSearchBar: React.FC = observer(() => {
  const { rootStore } = useStore();
  const { stockStore, portfolioStore } = rootStore;
  const navigate = useNavigate();

  // Refs for handling dropdown
  const searchRef = useRef<HTMLDivElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Debounce the search query with a 1.5 second delay
  const debouncedSearchQuery = useDebounce(stockStore.searchQuery, 1500);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length >= 2) {
      handleSearch();
    }
  }, [debouncedSearchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stockStore.setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = () => {
    if (stockStore.searchQuery.trim().length >= 2) {
      stockStore.searchStocks();
      setDropdownVisible(true);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle selecting a stock from the dropdown
  const handleSelectStock = (stock: StockSearchResult) => {
    stockStore.selectStock(stock.symbol);
    stockStore.clearSearch();
    setDropdownVisible(false);
    navigate(getStockDetailsRoute(stock.symbol));
  };

  // Handle adding a stock to portfolio directly from search
  const handleAddToPortfolio = (
    e: React.MouseEvent,
    stock: StockSearchResult
  ) => {
    e.stopPropagation();
    portfolioStore.addStock(stock.symbol);
    setDropdownVisible(false);
  };

  // Search dropdown menu content
  const searchResultsMenu = (
    <div
      style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        maxHeight: '400px',
        overflow: 'auto',
        width: '100%',
        minWidth: '300px',
      }}
    >
      {stockStore.isSearching ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <div style={{ marginTop: '10px' }}>{STOCK_SEARCH.LOADING}</div>
        </div>
      ) : stockStore.searchResults.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={stockStore.searchResults as StockSearchResult[]}
          renderItem={(item: StockSearchResult) => (
            <List.Item
              onClick={() => handleSelectStock(item)}
              style={{ cursor: 'pointer', padding: '8px 16px' }}
              actions={[
                <Button
                  key="add"
                  size="small"
                  onClick={(e) => handleAddToPortfolio(e, item)}
                >
                  Add
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{item.symbol}</Text>}
                description={item.name}
              />
            </List.Item>
          )}
        />
      ) : (
        stockStore.searchQuery && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            {STOCK_SEARCH.NO_RESULTS}
          </div>
        )
      )}
    </div>
  );

  return (
    <div
      ref={searchRef}
      style={{ position: 'relative', width: '100%', maxWidth: '300px' }}
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder={STOCK_SEARCH.PLACEHOLDER}
          value={stockStore.searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onFocus={() =>
            stockStore.searchResults.length > 0 && setDropdownVisible(true)
          }
          style={{ width: '100%' }}
        />
        <Button
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={stockStore.isSearching}
        />
      </Space.Compact>

      {/* Dropdown for search results */}
      {dropdownVisible && stockStore.searchQuery && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          {searchResultsMenu}
        </div>
      )}
    </div>
  );
});

export default StockSearchBar;
