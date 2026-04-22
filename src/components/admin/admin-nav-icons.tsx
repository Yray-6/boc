import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { active?: boolean };

const navTone = (active: boolean | undefined) =>
  active ? "text-[#003A8C]" : "text-[#99A1AF]";

export function IconDashboard({ active, className, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${navTone(active)} ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H7.5C7.96024 8.33333 8.33333 7.96024 8.33333 7.5V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6667 2.5H12.5C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V7.5C11.6667 7.96024 12.0398 8.33333 12.5 8.33333H16.6667C17.1269 8.33333 17.5 7.96024 17.5 7.5V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6667 11.667H12.5C12.0398 11.667 11.6667 12.0401 11.6667 12.5003V16.667C11.6667 17.1272 12.0398 17.5003 12.5 17.5003H16.6667C17.1269 17.5003 17.5 17.1272 17.5 16.667V12.5003C17.5 12.0401 17.1269 11.667 16.6667 11.667Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 11.667H3.33333C2.8731 11.667 2.5 12.0401 2.5 12.5003V16.667C2.5 17.1272 2.8731 17.5003 3.33333 17.5003H7.5C7.96024 17.5003 8.33333 17.1272 8.33333 16.667V12.5003C8.33333 12.0401 7.96024 11.667 7.5 11.667Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconProperties({ active, className, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${navTone(active)} ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M8.33333 10H11.6667"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 6.66699H11.6667"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 17.4997V14.9997C11.6667 14.5576 11.4911 14.1337 11.1785 13.8212C10.8659 13.5086 10.442 13.333 9.99999 13.333C9.55797 13.333 9.13404 13.5086 8.82148 13.8212C8.50892 14.1337 8.33333 14.5576 8.33333 14.9997V17.4997"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.33301H3.33333C2.8913 8.33301 2.46738 8.5086 2.15482 8.82116C1.84226 9.13372 1.66666 9.55765 1.66666 9.99967V15.833C1.66666 16.275 1.84226 16.699 2.15482 17.0115C2.46738 17.3241 2.8913 17.4997 3.33333 17.4997H16.6667C17.1087 17.4997 17.5326 17.3241 17.8452 17.0115C18.1577 16.699 18.3333 16.275 18.3333 15.833V7.49967C18.3333 7.05765 18.1577 6.63372 17.8452 6.32116C17.5326 6.0086 17.1087 5.83301 16.6667 5.83301H15"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 17.5V4.16667C5 3.72464 5.17559 3.30072 5.48816 2.98816C5.80072 2.67559 6.22464 2.5 6.66667 2.5H13.3333C13.7754 2.5 14.1993 2.67559 14.5118 2.98816C14.8244 3.30072 15 3.72464 15 4.16667V17.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconAgents({ active, className, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${navTone(active)} ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11594 12.5 3.2681 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 2.60645C14.0481 2.79175 14.6812 3.20917 15.1331 3.79316C15.585 4.37716 15.8302 5.09469 15.8302 5.83311C15.8302 6.57154 15.585 7.28906 15.1331 7.87306C14.6812 8.45706 14.0481 8.87447 13.3333 9.05978"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 17.5001V15.8334C18.3328 15.0948 18.087 14.3774 17.6345 13.7937C17.182 13.2099 16.5484 12.793 15.8333 12.6084"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16666 3.99238 4.16666 5.83333C4.16666 7.67428 5.65905 9.16667 7.5 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSettings({ active, className, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${navTone(active)} ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M8.05917 3.44712C8.10508 2.96407 8.32945 2.51549 8.68842 2.18902C9.04739 1.86255 9.51519 1.68164 10.0004 1.68164C10.4856 1.68164 10.9534 1.86255 11.3124 2.18902C11.6714 2.51549 11.8958 2.96407 11.9417 3.44712C11.9693 3.75916 12.0716 4.05997 12.2401 4.32407C12.4086 4.58817 12.6382 4.80779 12.9096 4.96435C13.1809 5.12091 13.486 5.20979 13.7989 5.22347C14.1119 5.23715 14.4235 5.17523 14.7075 5.04295C15.1484 4.84277 15.6481 4.8138 16.1092 4.96169C16.5703 5.10958 16.9599 5.42374 17.2021 5.84304C17.4443 6.26233 17.5219 6.75676 17.4197 7.23009C17.3175 7.70343 17.0428 8.1218 16.6492 8.40378C16.3928 8.58366 16.1836 8.82262 16.0391 9.10047C15.8946 9.37832 15.8192 9.68687 15.8192 10C15.8192 10.3132 15.8946 10.6217 16.0391 10.8996C16.1836 11.1774 16.3928 11.4164 16.6492 11.5963C17.0428 11.8783 17.3175 12.2966 17.4197 12.77C17.5219 13.2433 17.4443 13.7377 17.2021 14.157C16.9599 14.5763 16.5703 14.8905 16.1092 15.0384C15.6481 15.1863 15.1484 15.1573 14.7075 14.9571C14.4235 14.8248 14.1119 14.7629 13.7989 14.7766C13.486 14.7903 13.1809 14.8792 12.9096 15.0357C12.6382 15.1923 12.4086 15.4119 12.2401 15.676C12.0716 15.9401 11.9693 16.2409 11.9417 16.553C11.8958 17.036 11.6714 17.4846 11.3124 17.8111C10.9534 18.1375 10.4856 18.3184 10.0004 18.3184C9.51519 18.3184 9.04739 18.1375 8.68842 17.8111C8.32945 17.4846 8.10508 17.036 8.05917 16.553C8.03162 16.2408 7.92925 15.9399 7.76072 15.6757C7.5922 15.4115 7.36248 15.1918 7.09103 15.0352C6.81958 14.8786 6.51439 14.7898 6.20132 14.7762C5.88824 14.7626 5.5765 14.8247 5.2925 14.9571C4.85158 15.1573 4.35194 15.1863 3.89084 15.0384C3.42973 14.8905 3.04015 14.5763 2.7979 14.157C2.55566 13.7377 2.4781 13.2433 2.5803 12.77C2.68251 12.2966 2.95717 11.8783 3.35084 11.5963C3.60719 11.4164 3.81644 11.1774 3.96091 10.8996C4.10537 10.6217 4.1808 10.3132 4.1808 10C4.1808 9.68687 4.10537 9.37832 3.96091 9.10047C3.81644 8.82262 3.60719 8.58366 3.35084 8.40378C2.95772 8.12166 2.68354 7.70345 2.58159 7.23044C2.47963 6.75743 2.55718 6.2634 2.79916 5.84438C3.04114 5.42536 3.43026 5.11127 3.89091 4.96315C4.35156 4.81504 4.85082 4.84348 5.29167 5.04295C5.57563 5.17523 5.88729 5.23715 6.20025 5.22347C6.51322 5.20979 6.81828 5.12091 7.08962 4.96435C7.36095 4.80779 7.59058 4.58817 7.75906 4.32407C7.92753 4.05997 8.0299 3.75916 8.0575 3.44712"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconViewWebsite({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#99A1AF] ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M12.5 2.5H17.5V7.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 11.6667L17.5 2.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEnquiries({ active, className, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${navTone(active)} ${className ?? ""}`}
      aria-hidden
      {...props}
    >
      <path
        d="M17.5 13.3333C17.5 13.7754 17.3244 14.1993 17.0118 14.5118C16.6993 14.8244 16.2754 15 15.8333 15H5.83333L2.5 18.3333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V13.3333Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSignOut({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M13.3333 14.1663L17.5 9.99967L13.3333 5.83301"
        stroke="#FB2C36"
        strokeOpacity={0.6}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10H7.5"
        stroke="#FB2C36"
        strokeOpacity={0.6}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
        stroke="#FB2C36"
        strokeOpacity={0.6}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
