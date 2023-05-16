import React from "react";
import {
  Email,
  Facebook,
  Google,
  LinkedIn,
  Phone,
  Twitter,
  WhatsApp,
} from "@mui/icons-material";
import { Button } from "react-bootstrap";
function SocialIcons({ onMail, signByPhone, signByEmail, signByTwitter, signByGoogle, signByLinkedIn, signByWhatsApp,
   signByEmailText="Sign by email", signByPhoneText="Sign by phone",
    signByTwitterText="Sign by Twitter", signByGoogleText="Sign by Google",
      signByLinkedInText="Sign by LinkedIn", signByWhatsAppText="Sign by WhatsApp"
  }) {
  return (
    <div className="social-icons">
      {signByEmail && (
      <Button
      variant="outline-primary"
       onClick={signByEmail}>
          <Email />
        {signByEmailText}
      </Button>
      )}
      {signByPhone && (
      <Button
      variant="outline-primary"
       onClick={signByPhone}>
          <Phone />
        {signByPhoneText}
      </Button>
      )}
      {signByTwitter && (
      <Button
      variant="outline-primary"
       onClick={signByTwitter}>
          <Twitter />
        {signByTwitterText}
      </Button>
      )}
      {signByGoogle && (
      <Button
      variant="outline-primary"
       onClick={signByGoogle}>
          <Google />
        {signByGoogleText}
      </Button>
      )}
      {signByLinkedIn && (
      <Button
      variant="outline-primary"
       onClick={signByLinkedIn}>
          <LinkedIn />
        {signByLinkedInText}
      </Button>
      )}
      {signByWhatsApp && (
      <Button
      variant="outline-primary"
       onClick={signByWhatsApp}>
          <WhatsApp />
        {signByWhatsAppText}
      </Button>
      )}
    </div>
  );
}

export default SocialIcons;
