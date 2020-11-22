import { actions } from './actions';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

const initialState = {
  fileList: [],
  spatialAsset: null,
  spatialAssetLoaded: false,
  loadedCogs: null,
  loadedTiffJson: [],
  selectedCog: null,
  registeringSpatialAsset: false,
  spatialAssetRegistered: false,
  fetchingFromSkydb: false,
  fetchedFromSkydb: false,
  spatialAssetId: null,
};

export default function spatialAssetsReducer(state = initialState, action) {
  let reduced;
  switch (action.type) {
    case actions.SET_FILELIST:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SET_SPATIAL_ASSET:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.COGS_LOADED:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.UNLOAD_COGS:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SET_SELECTED_COG:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case LOCATION_CHANGE:
      reduced = {
        ...initialState,
      };
      break;

    case actions.REGISTERING_SPATIAL_ASSET:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.SPATIAL_ASSET_REGISTERED:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.CLEAN_REGISTRATION_STATUS:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.FETCHING_FROM_SKYDB:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    case actions.FETCHED_FROM_SKYDB:
      reduced = {
        ...state,
        ...action.payload,
      };
      break;

    default:
      reduced = state;
  }
  return reduced;
}
