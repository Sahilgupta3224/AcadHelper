import { useStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const AdminAssignmentAuth = (Component: React.FC) => {
  return (props: any) => {
    const { user } = useStore();
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const fetchAssignment = async () => {
        const id = router.query.id as string;
        if (!id) return;
        try {
          const res = await fetch(`/api/assignment?Id=${id}`);
          const json = await res.json();
          const CourseId = json?.data?.Course;
          if (user && CourseId) {
            const ok = (user.CoursesAsAdmin ?? []).some(
              (adminCourseId: string) => adminCourseId.toString() === CourseId
            );
            setHasAccess(ok);
            if (!ok) router.replace("/unauthorized");
          }
        } catch {
          router.replace("/unauthorized");
        }
      };
      fetchAssignment();
    }, [user, router.query.id]);

    return user && hasAccess ? <Component {...props} /> : null;
  };
};
