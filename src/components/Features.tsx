import { CheckIcon } from "@heroicons/react/24/outline";
const includedFeatures = [
  "Export to PDF file",
  "Store the historical data",
  "Send notifications to your email",
  "Separate different portfolios in different kinds of assets classes",
  "Alert of price changes",
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Features
      </h2>
      <p className="mt-4 text-gray-500">
        <h1 className="font-semibold text-gray-900">Generate Automatically</h1>
        Is this your first time trying out our product? Or do you want to add
        some lines automatically and customize them later? Click on{" "}
        <span className="font-bold">'Generate a Hypothetical Example'</span> to
        get started.
      </p>
      <p className="mt-4 text-gray-500">
        <h1 className="font-semibold text-gray-900">General Assets Class</h1>
        The Rebalance Assets Tool offers more than just stock comparison
        features. You can also add REITs, ETFs, bonds, cash, and other asset
        classes. This tool is designed to provide to your specific needs. Simply
        add the ticker symbol or type in the asset class, such as bonds, ETFs,
        cash, and more.
      </p>
      <p className="mt-4 text-gray-500">
        <h1 className="font-semibold text-gray-900">Delete and Bulk Delete</h1>
        Remove an asset and instantly see updated charts reflecting changes to
        your rebalancing strategy. To delete multiple assets at once, select the
        desired rows using the checkboxes and click{" "}
        <span className="font-bold">Bulk Delete</span> to remove them in bulk.
      </p>
      <p className="mt-4 text-gray-500">
        <h1 className="font-semibold text-gray-900">Enhanced Visuals</h1>
        Experience improved visualization with the{" "}
        <span className="font-bold">
          Rebalance Allocation Strategy Table
        </span>{" "}
        and the{" "}
        <span className="font-bold">Rebalance Allocation Strategy Chart</span>,
        designed to provide clearer and more insightful data representation.
      </p>
      <p className="mt-4 text-gray-500">
        <h1 className="font-semibold text-gray-900">Future Resources</h1>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
        >
          {includedFeatures.map((feature) => (
            <li key={"export"} className="flex gap-x-3">
              <CheckIcon
                aria-hidden="true"
                className="h-6 w-5 flex-none text-emerald-600"
              />
              {feature}
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
}
