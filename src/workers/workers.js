const api = require("../api");
const FormData = require('form-data');

module.exports = {
  
  /**
   * Deploys a worker.
   * If a zoneId is specified, it will deploy as "Single Script" which does not allow routing.
   * @param {*} options
   */
  async deploy({accountId, name, script, bindings, zoneId = null}) {
    accountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID;
    zoneId = zoneId || process.env.CLOUDFLARE_ZONE_ID;

    const formData = new FormData();
    formData.append('metadata', JSON.stringify({
      "body_part": "script",
      "bindings": bindings || []
    }));

    let url;
    if (zoneId) {
      url = `/zones/${zoneId}/workers/script`
    } else {
      url = `/accounts/${accountId}/workers/scripts/${name}`
    }

    formData.append('script', script);

    return await api.cfApiCall({
      url,
      method: `PUT`,
      body: formData
    });
  },

  /**
   * Removes a script. If zoneId is specified, it will remove the single script for the entire zone.
   * @param {*} options
   */
  async remove({accountId, name, zoneId}) {
    accountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!zoneId && !name) {
      throw("You must provide a script name");
    }

    let url;
    if (zoneId) {
      url = `/zones/${zoneId}/workers/script`
    } else {
      url = `/accounts/${accountId}/workers/scripts/${name}`
    }

    return await api.cfApiCall({
      url,
      method: `DELETE`
    });
  },

  /**
   * Gets settings for the account.
   * @param {*} options zoneId | accountId
   */
  async getSettings({zoneId, accountId} = {}) {
    zoneId = zoneId || process.env.CLOUDFLARE_ZONE_ID;
    accountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID;

    let url;
  
    if (accountId) {
      url = `/accounts/${accountId}/workers/settings`
    } else {
      url = `/zones/${zoneId}/workers/settings`
    }

    const result = await api.cfApiCall({
      url,
      method: 'GET'
    })

    return result;
  }
}
