# Authenticating requests

To authenticate requests, include an **`Authorization`** header with the value **`"Bearer {your-jwt-token}"`**.

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

Lấy token từ API <b>/login</b>, sau đó dán vào ô Authorize phía trên theo định dạng: Bearer {token}
