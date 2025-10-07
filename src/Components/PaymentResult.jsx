// backend/index.js
import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCUcS6lGH8xxpc1F0kvXGWkkT7TVjbnDN+b8paxFpByWz+ILtfy
0oTm/LIoAi2vB+VwxEWKRFcx29NqLnDT9DfIUNo7zRwexl5kz+7/vOINWDRT62wJ
rNbFOTGPxCO4oGcDbUPKIa7Nt5yuCywhER4ZeD2l6r2pp50csyCD+Nh+cQIDAQAB
AoGABSMIF49nL2o70Ar5yurHW37SJUwXS+2VHkjhFeuPVy/tXS0suHaJzZKys5eN
hm7Nyv7vx01nZrFMS1tebRXS5nuzpu/CSrq2lBTiyNeo24vvJ7gRhW6V4TthfKVt
0sNWD6idrevV4Hw9XzE219IK+DlyIMktZcXzCt7JRTXIUoUCQQDVEAHxnYfh7DDq
51WAOMjQW9zHtU+RvfaXe2pj1/d1WpKXpvn5KukBAyR6vEv9BewsQtvmcfKmv4kU
YzjRew+nAkEAsltg2MJ09MdjX+tXqWsZZ0mzsx1+Ry1PawcOkEH2tM09O9UxL8XE
uXf5ROLFNMgDQkC1BH2VEdQYOKZehaGEJwJBAINGxavVYC/3k3xo5OmIE1MuBq6W
LFykKxfS1w6Fttb7427FVygLJF2XThbBhiB0UbxDxbILa3MKeK+zIwMPS+kCQDXu
ba19t3Hg7MqvVjWTff3+ikkKDQomyFH7s0qpt5jaSr7R62qfqanPfl93Ftyr8lhR
SqtN8gqPELfojsJnoZcCQAbOkFaaqKcxGyvwOH5+fLn9POB/vqKUGjB3wXhXl01Z
n7pjRENl0bgnObR9DiM5fR+rOWcV9dJxUZn5URs1qRs=
-----END RSA PRIVATE KEY-----`;

app.post("/api/sign", (req, res) => {
  const t = req.body;

  const dataString =
    t.TranId + t.ReqTime + t.Amount + t.MerchantId + t.Currency;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(dataString);
  sign.end();

  const hash = sign.sign(PRIVATE_KEY, "base64");
  res.json({ hash });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
