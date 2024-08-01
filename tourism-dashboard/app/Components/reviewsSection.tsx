import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"; // Updated import

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

export default function ReviewTable({ data }: ReviewTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;
    const maxVisiblePages = 5; // Adjust as needed

    const offset = currentPage * itemsPerPage;
    const currentPageData = data.slice(offset, offset + itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 0 || pageNumber >= Math.ceil(data.length / itemsPerPage)) {
            return;
        }
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages);

    const pageNumbers = [];
    for (let i = startPage; i < endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mx-auto px-4 md:px-6 max-w-2xl grid gap-8">
            {currentPageData.map((review, index) => (
                <React.Fragment key={index}>
                    <div className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                                <div className="font-medium">Review from {review.Platform} ({review.date_of_stay})</div>
                                <div className={`bg-${review.Sentiment == 'Positive' ? 'green' : review.Sentiment == 'Negative' ? 'red' : 'gray'}-100 px-2 py-0.5 rounded-full text-xs font-medium`}>
                                    {review.Sentiment}
                                </div>
                                <div className={`bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium`}>
                                    {review.trip_type}
                                </div>
                            </div>
                            <ReviewContent review={review.review} />
                        </div>
                    </div>
                    {index !== currentPageData.length - 1 && <Separator />}
                </React.Fragment>
            ))}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {startPage > 0 && <PaginationEllipsis />}
                    {pageNumbers.map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink onClick={() => handlePageChange(pageNumber)}>{pageNumber + 1}</PaginationLink>
                        </PaginationItem>
                    ))}
                    {endPage < totalPages && <PaginationEllipsis />}
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

function ReviewContent({ review }: { review: string }) {
    const [expanded, setExpanded] = useState(false);
    const showSeeMore = review.length > 100; // Threshold for "See More"

    return (
        <div className="text-sm leading-loose text-muted-foreground">
            <p className={`${!expanded && showSeeMore ? 'line-clamp-3' : ''} whitespace-pre-wrap`}>{review}</p>
            {showSeeMore && (
                <button className="text-blue-500" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'See Less' : 'See More'}
                </button>
            )}
        </div>
    );
}
