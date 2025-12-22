import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessReviewApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // 답변 중인 리뷰 ID
  const [replyContent, setReplyContent] = useState(""); // 답변 내용
  const [editingReply, setEditingReply] = useState(null); // 수정 중인 리뷰 ID
  const [saving, setSaving] = useState(false);
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

  const handleReplySubmit = async (reviewId) => {
    if (!replyContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (editingReply === reviewId) {
        await businessReviewApi.updateReply(reviewId, replyContent);
        alert("답변이 수정되었습니다.");
      } else {
        await businessReviewApi.replyToReview(reviewId, replyContent);
        alert("답변이 작성되었습니다.");
      }
      setReplyContent("");
      setReplyingTo(null);
      setEditingReply(null);
      fetchReviews(); // 목록 새로고침
    } catch (err) {
      alert(err.message || (editingReply === reviewId ? "답변 수정에 실패했습니다." : "답변 작성에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyContent("");
    setReplyingTo(null);
    setEditingReply(null);
  };

  const handleReplyEdit = (review) => {
    setEditingReply(review._id);
    setReplyingTo(review._id);
    setReplyContent(review.reply?.content || "");
  };

  const handleReplyDelete = async (reviewId) => {
    if (!window.confirm("정말 답변을 삭제하시겠습니까?")) {
      return;
    }

    setSaving(true);
    try {
      await businessReviewApi.deleteReply(reviewId);
      alert("답변이 삭제되었습니다.");
      fetchReviews();
    } catch (err) {
      alert(err.message || "답변 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
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
              {/* 답변이 있고 내용이 있을 때만 답변 표시 */}
              {review.reply && review.reply.content && review.reply.content.trim() && editingReply !== review._id && (
                <div className="review-reply">
                  <strong>사업자 답변:</strong>
                  <p>{review.reply.content}</p>
                  <span className="reply-date">{review.reply.createdAt}</span>
                  <div className="reply-actions-inline">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleReplyEdit(review)}
                      disabled={saving}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-danger"
                      onClick={() => handleReplyDelete(review._id)}
                      disabled={saving}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
              
              {(replyingTo === review._id || editingReply === review._id) && (
                <div className="reply-form">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="고객님의 리뷰에 답변을 작성해주세요."
                    rows={4}
                    className="reply-textarea"
                  />
                  <div className="reply-form-actions">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleReplySubmit(review._id)}
                      disabled={saving}
                    >
                      {saving ? "저장 중..." : (editingReply === review._id ? "수정 완료" : "답변 등록")}
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={handleReplyCancel}
                      disabled={saving}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              <div className="review-actions">
                {/* 답변이 없거나 내용이 비어있을 때만 "답변 작성" 버튼 표시 */}
                {(!review.reply || !review.reply.content || !review.reply.content.trim()) && 
                 replyingTo !== review._id && 
                 editingReply !== review._id && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setReplyingTo(review._id);
                      setReplyContent("");
                      setEditingReply(null);
                    }}
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

