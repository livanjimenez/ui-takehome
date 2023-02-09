import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const fetchAPI = async () => {
    const res = await fetch('./MOCK_DATA.json');
    const data = await res.json();
    setData(data);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    const customerTotals = data.map((customer) => {
      const months = {};
      customer.purchases.forEach((purchase) => {
        const month = purchase.date.slice(0, 11);
        if (!months[month]) {
          months[month] = 0;
        }
        if (purchase.amount >= 100) {
          months[month] += (purchase.amount - 100) * 2 + 50;
        } else if (purchase.amount >= 50 && purchase.amount <= 100) {
          months[month] += purchase.amount - 50;
        }
      });
      return {
        name: customer.name,
        months: months,
        total: Object.values(months).reduce((sum, points) => sum + points, 0),
      };
    });

    setCustomerData(customerTotals);
  }, [data]);

  return (
    <div>
      {customerData.map((data) => (
        <ul>
          {Object.entries(data.months).map(([month, points]) => (
            <li key={data.customer_id}>
              {data.name} = {month}: {points}
            </li>
          ))}
          <li key={data.customer_id}>Total earned: {data.total}</li>
        </ul>
      ))}
    </div>
  );
}

export default App;
