import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./SimplyBlastStep2.css";
import ReactPaginate from "react-paginate";
import { RotatingLines } from "react-loader-spinner";

function SimplyBlastStep2({
  campaignName,
  setCampaignName,
  subscriptionStatus,
  setSubscriptionStatus,
  tag,
  setTag,
  onPrevious,
  onNext,
  token,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [pageCount, setPageCount] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [tagName, setTagName] = useState("");

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const handleSubscriptionStatusChange = (e) => {
    setSubscriptionStatus(e.target.value);
  };

  const handleTagChange = (e) => {
    const selectedTagId = e.target.value;
    const selectedTag = tags.find(tag => tag.id === selectedTagId);
  
    if (selectedTag) {
      setTag(selectedTag.id);
      setTagName(selectedTag.tagName);
    } else {
      setTag("None");
      setTagName("None");
    }
  };
  

  const handleNext = async () => {
    onNext();
  };

  const handlePrevious = async () => {
    onPrevious();
  };

  const fetchData = useCallback(
    async (pageIndex, pageSize) => {
      setLoading(true);
      try {
        const filters = [];

        if (subscriptionStatus !== "None") {
          filters.push({
            fieldName: "SubscriptionStatus",
            value: subscriptionStatus,
            operation: 0,
          });
        }

        if (tagName !== "None") {
          filters.push({
            fieldName: "TagName",
            value: tagName,
            operation: 0,
          });
        }

        const response = await axios.post(
          "https://app-simplyblast-api-qa-sea.azurewebsites.net/api/contact/search",
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

        console.log(subscriptionStatus)
        console.log(tagName)

        setPageCount(response.data.data.numOfPages);
        setResponseData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, subscriptionStatus, tagName]
  );

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchData]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "https://app-simplyblast-api-qa-sea.azurewebsites.net/api/tag",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        setTags(response.data.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [token]);

  useEffect(() => {
    if (campaignName && subscriptionStatus !== "None" && tag !== "None") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [campaignName, subscriptionStatus, tag]);

  return (
    <div className="step-content">
      <div>
        <table>
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>MobileNo</th>
              <th>Subscription Status</th>
              <th>Tags</th>
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
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.mobileNo}</td>
                  <td>{row.subscriptionStatus}</td>
                  <td>{row.tags}</td>
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
      <p>Create and Run a campaign with your Tenant account</p>
      <h4>Campaign</h4>
      <div className="form-group">
        <label>Campaign name*</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
        />
      </div>
      <div className="form-group">
        <label>Filter by subscription status*</label>
        <div className="custom-select">
          <select
            value={subscriptionStatus}
            onChange={handleSubscriptionStatusChange}
          >
            <option value="None">None</option>
            <option value="Unconfirmed">Unconfirmed</option>
            <option value="Subscribed">Subscribed</option>
            <option value="Unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Filter by tags*</label>
        <div className="custom-select">
        <select value={tag} onChange={handleTagChange}>
  <option value="None">None</option>
  {tags &&
    tags.map((tag) => (
      <option key={tag.id} value={tag.id}>
        {tag.tagName}
      </option>
    ))}
</select>
        </div>
      </div>
      <button className="button-no-background" onClick={handlePrevious}>
        Previous
      </button>
      <button
        className="button-no-background"
        onClick={handleNext}
        disabled={!isFormValid}
      >
        Next
      </button>
    </div>
  );
}

export default SimplyBlastStep2;
