import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { businessReviewApi } from "../../api/businessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessReviewDetailPage = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const data = await businessReviewApi.getReviewById(reviewId);
      setReview(data);
      setReplyContent(data.reply?.content || "");
      setIsEditingReply(false);
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || "리뷰 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (isEditingReply) {
        await businessReviewApi.updateReply(reviewId, replyContent);
        alert("답변이 수정되었습니다.");
      } else {
        await businessReviewApi.replyToReview(reviewId, replyContent);
        alert("답변이 작성되었습니다.");
      }
      fetchReview();
    } catch (err) {
      alert(err.message || (isEditingReply ? "답변 수정에 실패했습니다." : "답변 작성에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  };

  const handleReplyEdit = () => {
    setIsEditingReply(true);
    setReplyingTo(reviewId);
    setReplyContent(review.reply?.content || "");
  };

  const handleReplyDelete = async () => {
    if (!window.confirm("정말 답변을 삭제하시겠습니까?")) {
      return;
    }

    setSaving(true);
    try {
      await businessReviewApi.deleteReply(reviewId);
      alert("답변이 삭제되었습니다.");
      fetchReview();
    } catch (err) {
      alert(err.message || "답변 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleReport = async () => {
    const reason = prompt("신고 사유를 입력해주세요:");
    if (!reason) return;

    try {
      await businessReviewApi.reportReview(reviewId, reason, "");
      alert("리뷰 신고가 접수되었습니다.");
    } catch (err) {
      alert(err.message || "신고 접수에 실패했습니다.");
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!review) return <div>리뷰를 찾을 수 없습니다.</div>;

  return (
    <div className="business-review-detail-page">
      <div className="page-header">
        <button className="btn btn-outline" onClick={() => navigate("/business/reviews")}>
          ← 목록으로
        </button>
        <h1>리뷰 상세</h1>
      </div>

      <div className="review-detail">
        <div className="review-card">
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
            <h3>{review.title}</h3>
            <p>{review.content}</p>
          </div>
        </div>

        {/* 답변이 있고 내용이 있을 때만 답변 섹션 표시 */}
        {review.reply && review.reply.content && review.reply.content.trim() && !isEditingReply && (
          <div className="reply-section">
            <h3>사업자 답변</h3>
            <div className="reply-card">
              <p>{review.reply.content}</p>
              <span className="reply-date">{review.reply.createdAt}</span>
            </div>
            <div className="reply-actions">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleReplyEdit}
                disabled={saving}
              >
                수정
              </button>
              <button
                className="btn btn-sm btn-outline btn-danger"
                onClick={handleReplyDelete}
                disabled={saving}
              >
                삭제
              </button>
            </div>
          </div>
        )}

        {/* 답변 작성/수정 폼: 수정 중이거나 답변 작성 버튼을 클릭했을 때만 표시 */}
        {isEditingReply || (replyingTo === reviewId) ? (
          <div className="reply-section">
            <h3>{isEditingReply ? "답변 수정" : "답변 작성"}</h3>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="고객님의 리뷰에 답변을 작성해주세요."
                rows={5}
                required
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setIsEditingReply(false);
                    setReplyingTo(null);
                    setReplyContent(review.reply?.content || "");
                  }}
                  disabled={saving}
                >
                  취소
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "저장 중..." : (isEditingReply ? "수정 완료" : "답변 작성")}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* 답변이 없을 때만 "답변 작성" 버튼 표시 */
          (!review.reply || !review.reply.content || !review.reply.content.trim()) && (
            <div className="reply-section">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setReplyingTo(reviewId);
                  setReplyContent("");
                  setIsEditingReply(false);
                }}
              >
                답변 작성하기
              </button>
            </div>
          )
        )}

        <div className="review-actions-section">
          <button className="btn btn-outline btn-danger" onClick={handleReport}>
            리뷰 신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessReviewDetailPage;

