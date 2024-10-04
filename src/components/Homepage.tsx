import React, { useEffect, useState } from "react";
import sendDataToGoogleSheet from "../api/sendDataToGoogleSheet";
import { Chart } from "react-google-charts";
import {
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Asset {
  ticker: string;
  amount: string;
  averagePrice: string;
}

interface AssetsToRebalance {
  ticker: string;
  unitsAmount: string;
  moneyAmount: string;
  indicator: string;
}

const options = {
  title: "Asset Allocation",
  is3D: true,
};
const assetsToRebalanceOptions = {
  title: "Rebalance Asset Strategy",
  is3D: true,
};

export default function Homepage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleSendData = async () => {
      setLoading(true);
      setError(null);

      try {
        await sendDataToGoogleSheet(1, 'homepage');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    handleSendData();
  }, []);

  const [assets, setAssets] = useState<Asset[]>([
    { ticker: "", amount: "", averagePrice: "" },
  ]);
  const [chartData, setChartData] = useState<(string | number)[][]>([
    ["Ticker", "Value"],
  ]);
  const [chartAssetsToRebalanceData, setChartAssetsToRebalanceData] = useState<
    (string | number)[][]
  >([["Ticker", "Value"]]);

  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [showRebalanceTable, setShowRebalanceTable] = useState(false);
  const [assetsToRebalance, setAssetsToRebalance] = useState<
    AssetsToRebalance[]
  >([]);

  const handleAddField = () => {
    setAssets([...assets, { ticker: "", amount: "", averagePrice: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const newAssets = assets.filter((_, i) => i !== index);
    setAssets(newAssets);
    handleGenerate(newAssets); // Call handleGenerate with updated assets list
  };

  const handleInputChange = (
    index: number,
    field: keyof Asset,
    value: string
  ) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const calculateTotalPortfolioValue = (assetList: Asset[]) => {
    let totalValue = 0;
    assetList.forEach((asset) => {
      const amount = parseFloat(asset.amount);
      const averagePrice = parseFloat(asset.averagePrice);
      if (asset.ticker && !isNaN(amount) && !isNaN(averagePrice)) {
        totalValue += amount * averagePrice;
      }
    });
    return totalValue;
  };

  const calculateRebalanceData = (assetList: Asset[]) => {
    const rebalancedAssets: AssetsToRebalance[] = [];
    const totalValue = calculateTotalPortfolioValue(assetList);
    const targetPercentage = 100 / assetList.length; // Assuming equal allocation for simplicity
    const targetAllocation = (totalValue * targetPercentage) / 100;

    const rebalancedChartDataTemp: (string | number)[][] = [
      ["Ticker", "Value"],
    ];

    assetList.forEach((asset) => {
      const ticker = asset.ticker;
      const amount = parseFloat(asset.amount);
      const averagePrice = parseFloat(asset.averagePrice);

      if (ticker && !isNaN(amount) && !isNaN(averagePrice)) {
        const currentAllocation = amount * averagePrice;
        const difference = targetAllocation - currentAllocation;

        const unitsAmount = Math.abs(difference / averagePrice).toFixed(2);
        const moneyAmount = difference.toFixed(2);
        const indicator = difference > 0 ? "Buy" : "Sell";

        rebalancedAssets.push({ ticker, unitsAmount, moneyAmount, indicator });
        rebalancedChartDataTemp.push([ticker, targetAllocation]);
      }
    });

    setAssetsToRebalance(rebalancedAssets);
    setChartAssetsToRebalanceData(rebalancedChartDataTemp); // Set rebalanced chart data
  };

  const handleGenerate = (assetList = assets) => {
    const newChartData: (string | number)[][] = [["Ticker", "Value"]];
    assetList.forEach((asset) => {
      const amount = parseFloat(asset.amount);
      const averagePrice = parseFloat(asset.averagePrice);
      if (asset.ticker && !isNaN(amount) && !isNaN(averagePrice)) {
        newChartData.push([asset.ticker, amount * averagePrice]);
      }
    });
    setChartData(newChartData);

    // Calculate and set rebalance data with updated asset list
    calculateRebalanceData(assetList);
    setShowRebalanceTable(true);
  };

  const handleGenerateHypotheticalExample = () => {
    // Define the hypothetical data
    const hypotheticalAssets: Asset[] = [
      { ticker: "BAC", amount: "50", averagePrice: "30.00" },
      { ticker: "JPM", amount: "30", averagePrice: "150.00" },
      { ticker: "MS", amount: "20", averagePrice: "90.00" },
      { ticker: "WFC", amount: "40", averagePrice: "40.00" },
      { ticker: "GS", amount: "10", averagePrice: "350.00" },
    ];

    // Update the assets state with hypothetical data
    setAssets(hypotheticalAssets);

    // Generate chart data and rebalance data
    handleGenerate(hypotheticalAssets);
  };

  const handleSelectAsset = (index: number) => {
    setSelectedAssets((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleBulkDelete = () => {
    const newAssets = assets.filter(
      (_, index) => !selectedAssets.includes(index)
    );
    setAssets(newAssets);
    setSelectedAssets([]);
    handleGenerate(newAssets); // Call handleGenerate with updated assets list
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mt-8">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Assets
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Add your assets to generate a chart showing the percentage
                allocation of each one. After generating the chart, you can see
                your current Portfolio Allocation percentage and what the
                portfolio rebalance looks like.
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-600 flex items-center font-medium">
                <InformationCircleIcon
                  aria-hidden="true"
                  className="h-6 w-6 mr-2"
                />
                Reloading the page will clean up the data.
              </p>
            </div>

            {assets.map((asset, index) => (
              <div key={index} className="border-b border-gray-900/10 pb-4">
                <div className="flex items-end gap-x-6">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(index)}
                    onChange={() => handleSelectAsset(index)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded mb-3"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`ticker-${index}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ticker
                    </label>
                    <div className="mt-2">
                      <input
                        id={`ticker-${index}`}
                        name="ticker"
                        type="text"
                        placeholder="  AAPL"
                        value={asset.ticker}
                        onChange={(e) =>
                          handleInputChange(index, "ticker", e.target.value)
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor={`amount-${index}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Amount
                    </label>
                    <div className="mt-2">
                      <input
                        id={`amount-${index}`}
                        name="amount"
                        type="number"
                        placeholder="  34"
                        value={asset.amount}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex items-end">
                    <div className="w-full">
                      <label
                        htmlFor={`averagePrice-${index}`}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Average Price
                      </label>
                      <div className="mt-2">
                        <input
                          id={`averagePrice-${index}`}
                          name="averagePrice"
                          type="number"
                          placeholder="  194.89"
                          value={asset.averagePrice}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "averagePrice",
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {index === assets.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddField}
                        className="ml-3 mb-1 relative rounded-full bg-white-800 p-1 text-white-400 hover:text-gray focus:outline-none focus:ring-2 focus:ring-gray focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <PlusIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="ml-3 mb-1 relative rounded-full bg-white-800 p-1 text-white-400 hover:text-gray focus:outline-none focus:ring-2 focus:ring-gray focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                disabled={selectedAssets.length === 0}
                onClick={handleBulkDelete}
                className={`rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                  selectedAssets.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Bulk Delete
              </button>
              <button
                type="button"
                className="rounded-md bg-purple-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                onClick={handleGenerateHypotheticalExample}
              >
                Generate a hypothetical example
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => handleGenerate()}
              >
                Generate
              </button>
            </div>
          </div>
        </form>
        {chartData.length > 1 && (
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        )}
      </div>
      {showRebalanceTable && (
        <div className="mt-6 pb-4">
          <h2 className="text-center font-semibold leading-7 text-gray-900 mb-12">
            Rebalance Allocation Strategy
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Ticker</th>
                <th className="px-4 py-2 text-left">Units Amount</th>
                <th className="px-4 py-2 text-left">Money Amount</th>
                <th className="px-4 py-2 text-left">Buy/Sell</th>
              </tr>
            </thead>
            <tbody>
              {assetsToRebalance.map((asset) => (
                <tr key={asset.ticker} className="border-b">
                  <td className="px-4 py-2">{asset.ticker}</td>
                  <td className="px-4 py-2">{asset.unitsAmount}</td>
                  <td className="px-4 py-2">{asset.moneyAmount}</td>
                  <td className="px-4 py-2 flex items-center">
                    {asset.indicator === "Buy" ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-red-600 mr-2" />
                    )}
                    {asset.indicator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8">
        {chartAssetsToRebalanceData.length > 1 && (
          <Chart
            chartType="PieChart"
            data={chartAssetsToRebalanceData}
            options={assetsToRebalanceOptions}
            width={"100%"}
            height={"400px"}
          />
        )}
      </div>
    </div>
  );
}
