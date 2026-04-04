"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import { Link } from "@/i18n/navigation";
import {
  sendAnalyticsEvent,
  type ClientAnalyticsEventInput,
} from "@/lib/analytics";

type BaseTrackedProps = {
  analytics: ClientAnalyticsEventInput;
};

type TrackedLinkProps = BaseTrackedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "onClick"> & {
    onClick?: ComponentPropsWithoutRef<typeof Link>["onClick"];
  };

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  function TrackedLink({ analytics, onClick, ...props }, ref) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      sendAnalyticsEvent(analytics);
      onClick?.(event);
    }

    return <Link ref={ref} {...props} onClick={handleClick} />;
  },
);

type TrackedAnchorProps = BaseTrackedProps &
  Omit<ComponentPropsWithoutRef<"a">, "onClick"> & {
    onClick?: ComponentPropsWithoutRef<"a">["onClick"];
  };

export const TrackedAnchor = forwardRef<HTMLAnchorElement, TrackedAnchorProps>(
  function TrackedAnchor({ analytics, onClick, ...props }, ref) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      sendAnalyticsEvent(analytics);
      onClick?.(event);
    }

    return <a ref={ref} {...props} onClick={handleClick} />;
  },
);
