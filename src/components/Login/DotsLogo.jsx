import React from "react";

function DotsLogo({ ...props }) {
  return (
    <svg width="87" height="49" fill="none" viewBox="0 0 87 49" {...props}>
      <path
        fill="#646CFF"
        fillRule="evenodd"
        d="M21.9315 5.25075C23.4075 5.25682 24.5489 4.12446 24.555 2.64701C24.5618 1.18398 23.431 0.00763024 22.0104 4.58034e-05C20.5322 -0.00829707 19.3763 1.12406 19.3672 2.58785C19.3581 4.08502 20.4746 5.24468 21.9315 5.25075ZM24.555 10.1689C24.5512 11.6486 23.4067 12.7893 21.9391 12.7764C20.4715 12.7635 19.3604 11.6168 19.3672 10.1219C19.3748 8.68082 20.5428 7.50372 21.9641 7.50979C23.409 7.51813 24.5588 8.69751 24.555 10.1689ZM19.3954 26.0061C19.3896 26.0625 19.3837 26.1195 19.3791 26.1776C19.3258 26.1761 19.2729 26.1671 19.2221 26.1511C19.1474 26.108 19.0749 26.0618 19.0024 26.0156L19.0023 26.0155L19.0022 26.0155L19.0021 26.0154L19.002 26.0153L19.0019 26.0153L19.0018 26.0152C18.9684 25.9939 18.9349 25.9726 18.9012 25.9516C15.357 23.7195 11.5974 23.3001 7.72028 24.8571C2.11917 27.1097 -0.941905 32.9725 0.25871 38.8883C1.53593 45.1804 7.58679 49.7637 14.3165 48.554C18.8982 47.731 21.9911 45.0105 23.7212 40.7185C24.3287 39.2152 24.5304 37.6255 24.5304 36.0161C24.5345 30.0977 24.5345 24.1791 24.5304 18.2602C24.5296 17.9455 24.5062 17.6312 24.4606 17.3197C24.2559 15.9333 22.7921 14.9542 21.4269 15.2795C20.183 15.5753 19.4299 16.5181 19.4246 17.8241C19.4175 19.8426 19.4182 21.8611 19.4189 23.8795C19.4191 24.4731 19.4193 25.0667 19.4193 25.6603C19.4193 25.7746 19.4075 25.8888 19.3954 26.0061ZM5.08469 36.3491C5.09303 32.3801 8.35282 29.0991 12.2732 29.1128C16.1982 29.1264 19.4276 32.4143 19.4193 36.3893C19.4132 40.3453 16.1435 43.6226 12.2141 43.6066C8.31262 43.5907 5.07634 40.293 5.08469 36.3491ZM27.7031 36.3209C27.6971 43.2933 33.3391 48.7973 39.971 48.7419C46.7196 48.7882 52.2077 43.1165 52.2168 36.3778C52.2266 29.5624 46.6657 23.9385 39.9694 23.9689C33.2079 23.9992 27.7092 29.5108 27.7031 36.3209ZM39.9565 29.1142C43.8989 29.1126 47.1049 32.3664 47.1049 36.3664C47.1041 40.3588 43.8898 43.611 39.9474 43.608C36.0225 43.6019 32.793 40.3171 32.7999 36.3383C32.8075 32.3876 36.049 29.1142 39.9565 29.1142ZM77.0344 24.0675C79.2468 24.0789 81.0352 24.4232 82.6469 25.4327C83.4436 25.9276 84.1242 26.5886 84.6423 27.3705C85.3249 28.3952 85.2491 29.5912 84.4649 30.3512C83.7572 31.0338 82.857 31.1491 82.0029 30.6432C81.7471 30.4816 81.5037 30.3011 81.2748 30.1032C79.5183 28.6621 77.5691 28.1525 75.3726 28.8957C74.5255 29.1817 73.8982 29.7042 73.7041 30.6401C73.5099 31.5943 73.8277 32.4604 74.7105 32.8692C75.5933 33.278 76.5186 33.5602 77.4409 33.84C78.0232 34.0164 78.6124 34.172 79.2008 34.3274C80.2219 34.597 81.2409 34.8661 82.2191 35.2424C84.3427 36.0569 85.8012 37.5973 86.2844 39.8803C86.967 43.1112 85.783 45.8849 82.7955 47.423C81.3219 48.1814 79.739 48.4848 78.0932 48.5917C76.3973 48.7025 74.7682 48.4727 73.2126 47.8014C71.249 46.9543 69.748 45.6118 68.8834 43.6194C68.4511 42.6243 68.58 41.6307 69.2558 40.9876C70.1136 40.1715 71.7276 39.9531 72.4746 41.454C74.0272 44.5765 78.0113 44.9338 80.2107 43.8196C81.0587 43.3903 81.6404 42.729 81.7117 41.7407C81.7921 40.6175 81.2703 39.8021 80.103 39.3683C79.3489 39.0879 78.5639 38.8848 77.7815 38.6823L77.7805 38.682L77.7796 38.6818C77.6357 38.6446 77.4919 38.6073 77.3484 38.5697C77.0572 38.4933 76.765 38.4207 76.4728 38.3481C75.3465 38.0683 74.2209 37.7887 73.158 37.2925C71.1102 36.3368 69.5561 34.9345 69.0882 32.6341C68.4359 29.4274 69.5819 26.9033 72.6293 25.2196C74.1106 24.408 75.6965 24.044 77.0344 24.0675ZM62.3796 40.282L62.3796 40.2617V40.2616C62.3791 39.3641 62.3786 38.4666 62.3786 37.5691C62.3786 34.8053 62.3822 32.0423 62.3892 29.2801C62.39 28.7575 62.4052 28.7431 62.9141 28.7431C63.1786 28.7424 63.4437 28.7454 63.709 28.7485H63.7091H63.7093H63.7094C64.3159 28.7554 64.9236 28.7624 65.5277 28.7249C65.9518 28.7004 66.3639 28.5751 66.7298 28.3593C67.4837 27.8906 67.7681 27.0078 67.533 26.1735C67.2706 25.2399 66.5576 24.624 65.6369 24.5944C64.9805 24.5736 64.3254 24.5766 63.6708 24.5795H63.6706H63.6704C63.441 24.5805 63.2116 24.5815 62.9823 24.5815C62.6821 24.5808 62.5334 24.5804 62.4599 24.5059C62.3877 24.4328 62.3877 24.2886 62.3877 24.0028V19.6486C62.3874 19.4863 62.3883 19.3237 62.3892 19.1612V19.161V19.1609C62.3921 18.6294 62.395 18.0972 62.3544 17.5682C62.2815 16.6103 61.5132 15.735 60.5804 15.4628C59.5527 15.1632 58.5811 15.4666 57.9258 16.2773C57.4525 16.8613 57.3418 17.547 57.3418 18.2667C57.3416 18.7446 57.3407 19.2225 57.3399 19.7005V19.7005V19.7013C57.3372 21.1665 57.3345 22.6319 57.3517 24.0969C57.3562 24.5011 57.2053 24.5937 56.8503 24.5853C56.217 24.5694 55.5853 24.5679 54.9542 24.5853C53.7574 24.6187 52.892 25.5432 52.9064 26.7567C52.9193 27.8792 53.7832 28.7166 54.9611 28.737C55.4059 28.7447 55.8507 28.7433 56.2955 28.7419C56.4696 28.7414 56.6437 28.7408 56.8177 28.7408C57.338 28.7454 57.338 28.7469 57.338 29.2717C57.3345 34.6102 57.3345 39.9483 57.338 45.2863C57.3385 45.6014 57.358 45.9162 57.3964 46.229C57.5716 47.6807 59.0339 48.6667 60.4476 48.2874C61.6391 47.9651 62.3786 46.9981 62.3786 45.7087C62.3817 43.8996 62.3806 42.0907 62.3796 40.282Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default DotsLogo;
