import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Country.css";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(18);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data);
        setFilteredCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = countries.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (country.currencies &&
            Object.keys(country.currencies)
              .join(", ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredCountries(filtered);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, countries]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Get current cards
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCountries.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCountries.length / cardsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="country-container">
      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by country or currency..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}
      {/* Display Cards */}
      {!loading && (
        <div className="country-grid">
          {currentCards.map((country) => (
            <div key={country.name.common} className="country-card">
              <div ><img
                src={country.flags.png}
                alt={country.name.common}
                className="country-flag"
              /></div>
              <div>
              <p className="country-name">{country.name.common}</p>
              <p className="country-currency">
                Currency:{" "}
                {country.currencies
                  ? Object.keys(country.currencies).join(", ")
                  : "N/A"}
              </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <div key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={
                currentPage === number ? "page-link active" : "page-link"
              }
            >
              {number}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Country;
