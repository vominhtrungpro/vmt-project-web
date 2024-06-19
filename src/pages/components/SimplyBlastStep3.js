import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./SimplyBlastStep3.css";
import ReactPaginate from "react-paginate";
import { RotatingLines } from "react-loader-spinner";

function SimplyBlastStep3({ onPrevious, onNext, token }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [pageCount, setPageCount] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);

  const pricingTypeEnum = {
    1: "Utility",
    2: "Authentication",
    3: "Marketing",
    4: "Service",
  };

  const statusEnum = {
    0: "Draft",
    1: "Pending",
    2: "Approved",
    3: "Pending Review",
    4: "Rejected",
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const handleNext = async () => {
    onNext();
  };

  const handleChooseTemplate = (e) => {
    setTemplate(e);
    console.log(e);
  };

  const handlePrevious = async () => {
    onPrevious();
  };

  const fetchData = useCallback(
    async (pageIndex, pageSize) => {
      setLoading(true);
      try {
        const filters = [];

        const response = await axios.post(
          "https://app-simplyblast-api-qa-sea.azurewebsites.net/api/template/search",
          {
            pageIndex: pageIndex + 1,
            pageSize: pageSize,
            filters: filters,
            sortBy: {
              fieldName: "Id",
              ascending: true,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        setPageCount(response.data.data.numOfPages);
        setResponseData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchData]);

  return (
    <div className="step-content">
      <p>Choose a template for your message</p>
      <div>
        <table>
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  <RotatingLines color="#00BFFF" height={80} width={80} />
                </td>
              </tr>
            ) : (
              responseData &&
              responseData.map((row) => (
                <tr
                  key={row.id}
                  data-id={row}
                  onClick={() => handleChooseTemplate(row)}
                >
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{pricingTypeEnum[row.pricingType]}</td>
                  <td>{statusEnum[row.status]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
        <div className="rows-per-page">
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>Rows per page</span>
        </div>
      </div>
      <h4>Template</h4>
      <div class="phone-frame">
        <div class="speaker"></div>
        <div class="phone-screen">
          <div class="messages">
            {template && (
              <div class="message received">
                <div>{template.content}</div>
                <div>
                  {" "}
                  {template.mediaList &&
                    template.mediaList.map((row) => (
                      <img src={row} alt="Girl in a jacket"></img>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="home-button"></div>
      </div>

      <button className="button-no-background" onClick={handlePrevious}>
        Previous
      </button>
      <button className="button-no-background" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default SimplyBlastStep3;
