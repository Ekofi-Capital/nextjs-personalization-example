"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selection, setSelection] = useState(null); // State to track selection
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "user@example.com", // Replace with dynamic user_id
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        console.log("Success:", result);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle clicks on A, B, C, or D
  const handleClick = async (selection) => {
    setSelection(selection); // Update the selection state

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parameter: selection, // Example parameter
          user_id: "user@example.com", // Replace with dynamic user_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sortedValues = () => {
    const allOptions = ["A", "B", "C", "D"]; // All possible options
    const counts = {};

    // Initialize counts for all options to zero
    allOptions.forEach((option) => {
      counts[option] = 0;
    });

    // Populate counts based on fetched data
    if (data) {
      const items = data.data["user@example.com"]; // Access the user data
      items &&
        items.forEach(({ value, count }) => {
          counts[value] = count; // Update the count if it exists in the fetched data
        });
    }

    // Sort values based on count in descending order
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([value]) => value);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <button className="list-inside list-decimal text-sm text-center sm:text-center">
        Login
      </button> */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <a className="list-inside list-decimal text-sm text-center sm:text-center">
          Navbar example:
        </a>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {sortedValues().map((value) => (
            <button
              key={value}
              onClick={() => handleClick(value)}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              {value}
            </button>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          User info:{" "}
          {data &&
            Object.entries(data.data).map(([email, items]) => (
              <div key={email}>
                <h3>{email}</h3>
                {items.map((item, index) => (
                  <p key={index}>
                    Value: {item.value}, Count: {item.count}
                  </p>
                ))}
              </div>
            ))}
        </a>
      </footer>
    </div>
  );
}
