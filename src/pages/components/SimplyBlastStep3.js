import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./SimplyBlastStep3.css";
import ReactPaginate from "react-paginate";
import { RotatingLines } from "react-loader-spinner";
import moment from 'moment';


function SimplyBlastStep3({
  campaignName,
  tag,
  subScriptionStatus,
  onPrevious,
  onNext,
  token,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [pageCount, setPageCount] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
    createCampaign();
  };

  const handleChooseTemplate = (e) => {
    setTemplate(e);
    extractPlaceholders(e.content);
  };

  const extractPlaceholders = (template) => {
    const regex = /{{\s*([^{}]+)\s*}}/g;
    let match;
    const placeholders = [];
    while ((match = regex.exec(template)) !== null) {
      placeholders.push(match[0]);
    }
    return placeholders;
  };

  const handlePrevious = async () => {
    onPrevious();
  };

  const fetchFields = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://app-simplyblast-api-qa-sea.azurewebsites.net/api/contact/fields",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const filteredData = response.data.data.filter(
        (item) =>
          item.binding !== "SubscriptionStatus" && item.binding !== "Tags"
      );
      setFields(filteredData);
    } catch (error) {
      console.error("Error fetching data!:", error);
    }
  }, [token]);

  const fetchTemplates = useCallback(
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

  const createCampaign = useCallback(async () => {
    const recipientRequest = {
      isUnconfirmed: subScriptionStatus === "Unconfirmed",
      isSubscribe: subScriptionStatus === "Subscribed",
      isUnsubscribe: subScriptionStatus === "Unsubscribe",
      tagFilters: [tag],
    };

    const messageRequest = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      isInitialize: true,
      name: "Initial message",
      content: "string",
      templateId: template.id,
      broadcastSchedule: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString(),
      buttons: []
    }

    const createCampaignRequest = {
      name: campaignName,
      isEnableTwoWay: false,
      isBypassUnsubBlock: false,
      isTurnOnFollowingMessage: false,
      status: "Pending",
      recipientRequest: recipientRequest,
      messageRequests: [messageRequest],
      twoWayRequests: [],
    };

    console.log(createCampaignRequest);
  }, [campaignName, subScriptionStatus, tag, date, time, template]);

  useEffect(() => {
    fetchTemplates(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchTemplates]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setDate(formattedDate);

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);

    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    setTime(formattedTime);
  }, []);

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
      <div className="template-container">
        <div className="phone-frame">
          <div className="speaker"></div>
          <div className="phone-screen">
            <div className="messages">
              {template && (
                <div className="message received">
                  <div>{template.content}</div>
                  <div>
                    {template.mediaList &&
                      template.mediaList.map((row) => (
                        <img src={row} alt="Girl in a jacket"></img>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="value-form">
          <div className="form-group">
            <label for="username">Broadcast Date*</label>
            <input
              type="date"
              id="broadcast-date"
              name="broadcast-date"
              value={date}
            ></input>
          </div>
          <div className="form-group">
            <label for="username">Broadcast Time*</label>
            <input
              type="time"
              id="broadcast-time"
              name="broadcast-time"
              value={time}
            ></input>
          </div>
          {template && (
            <div>
              {template.content &&
                extractPlaceholders(template.content).map((row) => (
                  <div className="form-group">
                    <label for="username">{row}</label>
                    <select>
                      {fields &&
                        fields.map((field) => (
                          <option>{field.displayName}</option>
                        ))}
                    </select>
                  </div>
                ))}
            </div>
          )}
        </div>
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
