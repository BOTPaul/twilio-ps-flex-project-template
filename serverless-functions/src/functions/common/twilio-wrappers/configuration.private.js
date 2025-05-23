const { isString, omitBy, isNil, merge } = require('lodash');
const axios = require('axios');

const { executeWithRetry, getRegionUrl } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} the current configuration
 * @description fetches current config from flex api
 */
exports.fetchUiAttributes = async function fetchUiAttributes(parameters) {
  return executeWithRetry(parameters.context, async () => {
    const configUrl = `https://flex-api.${getRegionUrl()}/v1/Configuration`;
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    const getResponse = await axios.get(configUrl, config);

    return getResponse?.data?.ui_attributes;
  });
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {object} parameters.attributesUpdate the attributes to update
 * @param {string} parameters.mergeFeature boolean string, whether we should overwrite or merge with existing config
 * @returns {object} https://www.twilio.com/docs/lookup/v2-api#making-a-request
 * @description updates config using flex api
 */
exports.updateUiAttributes = async function updateUiAttributes(parameters) {
  const { attributesUpdate, mergeFeature } = parameters;

  if (!isString(attributesUpdate))
    throw new Error('Invalid parameters object passed. Parameters must contain attributesUpdate string');

  return executeWithRetry(parameters.context, async () => {
    const configUrl = `https://flex-api.${getRegionUrl()}/v1/Configuration`;
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    // we need to fetch the config first so that we do not overwrite another setting
    const getResponse = await axios.get(configUrl, config);
    const existingData = getResponse?.data?.ui_attributes;
    const parsedUpdate = JSON.parse(attributesUpdate);

    // if the feature's config should be overwritten, clear old data
    if (mergeFeature === 'false' && parsedUpdate?.custom_data?.features) {
      for (const featureName in parsedUpdate.custom_data.features) {
        if (existingData?.custom_data?.features && existingData.custom_data.features[featureName]) {
          existingData.custom_data.features[featureName] = {};
        }
      }
    }

    if (mergeFeature === 'false' && parsedUpdate?.custom_data?.common) {
      existingData.custom_data.common = {};
    }

    // merge the objects
    const updatedAttributes = omitBy(
      merge({ account_sid: process.env.ACCOUNT_SID }, { ui_attributes: existingData }, { ui_attributes: parsedUpdate }),
      isNil,
    );
    const postResponse = await axios.post(configUrl, updatedAttributes, config);

    return postResponse?.data?.ui_attributes;
  });
};
