import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import RatingDots from "./RatingDots";
import type { Freelancer } from "@/lib/types";
import { AVAILABILITY_LABELS, formatKES } from "@/lib/utils";

export default function FreelancerCard({
  freelancer,
  priority = false,
}: {
  freelancer: Freelancer;
  priority?: boolean;
}) {
  return (
    <article className="aw-fcard">
      <div className="aw-fcard__media">
        <Image
          src={freelancer.avatar}
          alt={`${freelancer.name}, ${freelancer.title}`}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 1080px) 33vw, 280px"
          priority={priority}
          style={{ objectFit: "cover", objectPosition: "center 24%" }}
        />
        <span className="aw-fcard__status">
          <i
            className={`aw-dot${
              freelancer.availability === "limited"
                ? " aw-dot--limited"
                : freelancer.availability === "busy"
                  ? " aw-dot--busy"
                  : ""
            }`}
            aria-hidden="true"
          />
          {AVAILABILITY_LABELS[freelancer.availability]}
        </span>
      </div>
      <div className="aw-fcard__body">
        <h3 className="aw-fcard__name">
          <Link href={`/freelancers/${freelancer.username}`}>{freelancer.name}</Link>
        </h3>
        <p className="aw-fcard__title">{freelancer.title}</p>
        <div className="aw-tags">
          {freelancer.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="aw-tag">
              {skill}
            </span>
          ))}
        </div>
        <RatingDots rating={freelancer.rating} reviewCount={freelancer.reviewCount} />
        <div className="aw-fcard__meta">
          <span className="aw-rate">
            {formatKES(freelancer.hourlyRate)}
            <small>/hr</small>
          </span>
          <span className="aw-fcard__jobs">
            {freelancer.completedJobs} jobs
            <br />
            replies {freelancer.responseTime}
          </span>
        </div>
        <div className="aw-inline aw-gap-1" style={{ justifyContent: "space-between" }}>
          <span className="aw-small aw-inline">
            <MapPin size={12} aria-hidden="true" /> {freelancer.location.split(",")[0]}
          </span>
          <Link
            href={`/freelancers/${freelancer.username}#hire`}
            className="aw-btn aw-btn--green aw-btn--sm"
          >
            Hire me
          </Link>
        </div>
      </div>
    </article>
  );
}
