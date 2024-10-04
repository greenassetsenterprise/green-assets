import { useEffect, useState } from 'react';
import sendDataToGoogleSheet from "../api/sendDataToGoogleSheet";

export default function About() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleSendData = async () => {
      setLoading(true);
      setError(null);

      try {
        await sendDataToGoogleSheet(1, 'about');
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        About Us
      </h2>
      <p className="mt-4 text-gray-500">
        We're a group of investors who recognized the need for a simple yet
        powerful tool to help us rebalance our assets, protect our investments,
        and grow our wealth. Our platform goes beyond just tracking shares; it
        allows you to compare various asset classes and make informed decisions
        about your next investment moves.
      </p>
      <p className="mt-4 text-gray-500">
        The purpose of this tool is not just to add shares and allocate next
        month's capital. It's a powerful platform that allows you to add and
        compare various asset classes, helping you review your investments and
        determine where to allocate your next portion of money to rebalance your
        portfolio.
      </p>
      <p className="mt-4 text-gray-500">
        If you find this resource helpful, we encourage you to provide feedback.
        We're working to implement a platform that enables users like you to
        track and store more information. Future features may include storing
        charts of all assets, sending email notifications, exporting charts in
        PDF format, and more.
      </p>
      <p className="mt-4 text-gray-500">
        Thank you very much! We really appreciate it.
      </p>
      <p className="mt-4 text-gray-500">greenassetsenterprise@gmail.com</p>
    </div>
  );
}
