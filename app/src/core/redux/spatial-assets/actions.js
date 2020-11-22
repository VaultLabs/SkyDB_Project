export const actions = {
  SET_FILELIST: 'spatial-assets/SET_FILELIST',
  SET_SPATIAL_ASSET: 'spatial-assets/SET_SPATIAL_ASSET',
  LOAD_COGS: 'spatial-assets/LOAD_COGS',
  UNLOAD_COGS: 'spatial-assets/UNLOAD_COGS',
  COGS_LOADED: 'spatial-assets/COGS-LOADED',
  SET_SELECTED_COG: 'spatial-assets/SET_SELECTED_COG',
  REGISTER_SPATIAL_ASSET: 'spatial-assets/REGISTER_SPATIAL_ASSET',
  REGISTERING_SPATIAL_ASSET: 'spatial-assets/REGISTERING_SPATIAL_ASSET',
  SPATIAL_ASSET_REGISTERED: 'spatial-assets/SPATIAL_ASSET_REGISTERED',
  STOP_CHANNEL_FORK: 'spatial-assets/STOP_CHANNEL_FORK',
  CLEAN_REGISTRATION_STATUS: 'spatial-assets/REGISTRATION_CLEANED',
  FETCH_FROM_SKYDB: 'spatial-assets/FETCH_FROM_SKYDB',
  FETCHING_FROM_SKYDB: 'spatial-assets/FETCHING_FROM_SKYDB',
  FETCHED_FROM_SKYDB: 'spatial-assets/FETCHED_FROM_SKYDB',
};

export const setFileList = (fileList) => {
  return {
    type: actions.SET_FILELIST,
    payload: {
      fileList,
    },
  };
};

export const setSpatialAsset = (spatialAsset, spatialAssetLoaded) => {
  return {
    type: actions.SET_SPATIAL_ASSET,
    payload: {
      spatialAsset,
      spatialAssetLoaded,
    },
  };
};

export const loadCogs = (loadedCogs) => {
  return {
    type: actions.LOAD_COGS,
    payload: {
      loadedCogs,
    },
  };
};

export const unloadCogs = () => {
  return {
    type: actions.UNLOAD_COGS,
    payload: {
      loadedCogs: null,
      loadedTiffJson: [],
      selectedCog: null,
    },
  };
};

export const setSelectedCog = (selectedCog) => {
  return {
    type: actions.SET_SELECTED_COG,
    payload: {
      selectedCog,
    },
  };
};

export const registerSpatialAsset = () => {
  return {
    type: actions.REGISTER_SPATIAL_ASSET,
  };
};

export const cleanRegistrationStatus = () => {
  return {
    type: actions.CLEAN_REGISTRATION_STATUS,
    payload: {
      spatialAssetRegistered: false,
    },
  };
};

export const fetchFromSkyDB = (stacId) => {
  return {
    type: actions.FETCH_FROM_SKYDB,
    payload: {
      stacId,
    },
  };
};
