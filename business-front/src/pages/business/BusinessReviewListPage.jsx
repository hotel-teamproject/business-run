import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessReviewApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await businessReviewApi.getReviews();
      setReviews(data.reviews);
    } catch (err) {
      setError(err.message || "리뷰 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReviews} />;

  return (
    <div className="business-review-list-page">
      <div className="page-header">
        <h1>리뷰 관리</h1>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="review-user-info">
                  <span className="review-user">{review.userName}</span>
                  <span className="review-rating">
                    {"⭐".repeat(review.starRating)}
                  </span>
                  <span className="review-date">{review.wroteOn}</span>
                </div>
                <div className="review-hotel">{review.hotelName}</div>
              </div>
              <div className="review-content">
                <h4>{review.title}</h4>
                <p>{review.content}</p>
              </div>
              {review.reply && (
                <div className="review-reply">
                  <strong>사업자 답변:</strong>
                  <p>{review.reply.content}</p>
                  <span className="reply-date">{review.reply.createdAt}</span>
                </div>
              )}
              <div className="review-actions">
                {!review.reply && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/business/reviews/${review._id}`)}
                  >
                    답변 작성
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/business/reviews/${review._id}`)}
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessReviewListPage;

