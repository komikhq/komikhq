import { useParams } from "react-router";
import { AdminComicDetailView } from "@/routes/dashboard/comics/detail/_components/admin-comic-detail-view";

export default function DashboardComicDetailRoute() {
  const { id } = useParams();
  return <AdminComicDetailView comicId={id || ""} />;
}

