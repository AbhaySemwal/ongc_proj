"use client"
import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [patient, setPatient] = useState([]);
  const [testTypes, setTestTypes] = useState({ ECG: 0, Dopler: 0, Echo: 0 });
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const res = await fetch(`/api/patient`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const x = await res.json();
        setPatient(x);

        // Count test types
        const counts = x.reduce((acc, curr) => {
          if (["ECG", "Dopler", "Echo"].includes(curr.test)) {
            acc[curr.test] = (acc[curr.test] || 0) + 1;
          }
          return acc;
        }, { ECG: 0, Dopler: 0, Echo: 0 });
        setTestTypes(counts);
      } catch (err) {
        console.log(err);
      }
    };
    getPatient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const dob = e.target[1].value;
    const gender = e.target[2].value;
    const contact = e.target[3].value;
    const test = e.target[4].value;

    if (!["ECG", "Dopler", "Echo"].includes(test)) {
      alert("Invalid test type. Please enter 'ECG', 'Dopler', or 'Echo'.");
      return;
    }

    setPatient((prev) => [...prev, { name, dob, gender, contact, test }]);
    e.target.reset();

    // Update test types
    setTestTypes((prev) => ({
      ...prev,
      [test]: (prev[test] || 0) + 1,
    }));

    try {
      await fetch(`/api/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dob,
          gender,
          contact,
          test,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = myChartRef.current;
      if (chart) {
        chart.destroy();
      }
      myChartRef.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: ["ECG", "Dopler", "Echo"],
          datasets: [
            {
              label: "Test Types",
              data: Object.values(testTypes),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Test Types Distribution'
            }
          }
        },
      });
    }
  }, [testTypes]);
  console.log(testTypes)
  return (
    <div className="flex flex-col justify-center px-5">
      <h1 className="text-center py-5 text-lg md:text-2xl font-semibold">Patients&apos; Data</h1>
      <div className="border-[1px] border-gray-500 text-[8px] md:text-base">
        <div className="grid grid-cols-6 justify-center">
          <div className="border-[1px] border-gray-500 p-1">Index</div>
          <div className="border-[1px] border-gray-500 p-1">Name</div>
          <div className="border-[1px] border-gray-500 p-1">DOB</div>
          <div className="border-[1px] border-gray-500 p-1">Gender</div>
          <div className="border-[1px] border-gray-500 p-1">Contact</div>
          <div className="border-[1px] border-gray-500 p-1">Test Type</div>
        </div>
        {patient?.map((pt, index) => (
          <div key={index} className="grid grid-cols-6">
            <div className="border-[1px] border-gray-500 p-1">{index + 1}</div>
            <div className="border-[1px] border-gray-500 p-1">{pt.name}</div>
            <div className="border-[1px] border-gray-500 p-1">{pt.dob}</div>
            <div className="border-[1px] border-gray-500 p-1">{pt.gender}</div>
            <div className="border-[1px] border-gray-500 p-1">{pt.contact}</div>
            <div className="border-[1px] border-gray-500 p-1">{pt.test}</div>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="relative grid grid-cols-6">
          <div className="border-[1px] border-gray-500 p-1">{patient.length + 1}</div>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Name"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="DOB"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Gender"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Contact"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Test Type"></input>
          <button className="absolute -bottom-6 md:-bottom-10 right-0 bg-slate-600 p-1 px-2 rounded-md">Submit</button>
        </form>
      </div>
      <div className="h-64 w-64 mt-5">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
