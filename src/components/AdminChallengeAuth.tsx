import { useStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import User from "@/models/userModel";
import Challenge from "@/models/challengeModel";

export const AdminChallengeAuth = (Component: React.FC) => {
  return (props: any) => {
    const { user } = useStore();
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const fetchChallenge = async () => {
        const id = router.query.id as string;
        if (!id) return;
        try {
          const res = await fetch(`/api/challenge?Id=${id}`);
          const json = await res.json();
          const CourseId = json?.data?.courseId;
          const ok =
            CourseId &&
            (user?.CoursesAsAdmin ?? []).some(
              (adminCourseId: string) => adminCourseId.toString() === CourseId
            );
          setHasAccess(!!ok);
          if (!ok) router.replace("/unauthorized");
        } catch {
          router.replace("/unauthorized");
        }
      };
      fetchChallenge();
    }, [user, router.query.id]);

    return user && hasAccess ? <Component {...props} /> : null;
  };
};
