import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { faker } from '@faker-js/faker';
import ReactPaginate from 'react-paginate';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface ReviewData {
    "": number;
    date_of_stay: string;
    review: string;
    trip_type: string;
    "Hotel URL": string;
    Sentiment: string;
    Platform: string;
}

interface ReviewTableProps {
    data: ReviewData[];
}

const PER_PAGE = 3;

const ReviewTable: React.FC<ReviewTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});
    const tableRef = useRef<HTMLDivElement>(null);

    const offset = currentPage * PER_PAGE;
    const currentPageData = data.slice(offset, offset + PER_PAGE);
    const pageCount = Math.ceil(data.length / PER_PAGE);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleDownload = async () => {
        if (tableRef.current) {
            const canvas = await html2canvas(tableRef.current);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'reviews_table.png';
            link.click();
        }
    };

    const toggleReviewExpansion = (index: number) => {
        setExpandedReviews((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="relative">
            <div
                style={{
                    position: 'absolute',
                    right: '10px',
                    zIndex: 20,
                    cursor: 'pointer',
                }}
                onClick={handleDownload}
            >
                <button className="button-22" role="button"><FontAwesomeIcon icon={faDownload} /></button>
            </div>
            <div ref={tableRef} className="table-container" style={{ overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((review, index) => (
                            <tr
                                key={index}
                                className={review.Sentiment === 'Positive' ? 'bg-green-100' : 'bg-red-100'}
                            >
                                <td>
                                    <Image src={faker.image.avatar()} alt="User Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                                </td>
                                <td>{faker.internet.userName()}</td>
                                <td>
                                    <p
                                        className={classNames({
                                            'line-clamp-3': !expandedReviews[index],
                                            'whitespace-pre-wrap': true,
                                        })}
                                    >
                                        {review.review}
                                    </p>
                                    {review.review.length > 100 && (
                                        <button
                                            className="text-blue-500"
                                            onClick={() => toggleReviewExpansion(index)}
                                        >
                                            {expandedReviews[index] ? 'See Less' : 'See More'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
            />
        </div>
    );
};

export default ReviewTable;
