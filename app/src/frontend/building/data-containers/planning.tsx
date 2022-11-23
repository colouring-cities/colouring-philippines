import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';
import InfoBox from '../../components/info-box';
import CheckboxDataEntry from '../data-components/checkbox-data-entry';
import NumericDataEntryWithFormattedLink from '../data-components/numeric-data-entry-with-formatted-link';
import { buildingUserFields, dataFields } from '../../config/data-fields-config';
import NumericDataEntry from '../data-components/numeric-data-entry';
import UserOpinionEntry from '../data-components/user-opinion-data-entry';

import DataEntry from '../data-components/data-entry';
import { DataEntryGroup } from '../data-components/data-entry-group';
import SelectDataEntry from '../data-components/select-data-entry';
import Verification from '../data-components/verification';
import withCopyEdit from '../data-container';
import PlanningDataOfficialDataEntry from '../data-components/planning-data-entry';
import DataTitle from '../data-components/data-title';

import { CategoryViewProps } from './category-view-props';
import { Category } from '../../config/categories-config';

const currentYear = new Date().getFullYear();
const currentTimestamp = new Date().valueOf();
const milisecondsInYear = 1000 * 60 * 60 * 24 * 365;

// TODO: there is already "parseDate" in helpers
function parseDate(isoUtcDate: string): Date {
    const [year, month, day] = isoUtcDate.match(/^(\d{4})-(\d\d)-(\d\d)$/)
        .splice(1)
        .map(x => parseInt(x, 10));
    return new Date(Date.UTC(year, month-1, day));
}

function isArchived(item) {
    const decisionDate = item.decision_date;
    if(decisionDate != null) {
        if ((currentTimestamp - parseDate(decisionDate).valueOf()) > milisecondsInYear) {
            return true;
        }
    }
    if(item.registered_with_local_authority_date != null) {
        if ((currentTimestamp - parseDate(item.registered_with_local_authority_date).valueOf()) > milisecondsInYear) {
            return true;
        }
    }
    return false;
}

const PlanningView: React.FunctionComponent<CategoryViewProps> = (props) => {
    const communityLinkUrl = `/${props.mode}/${Category.Community}/${props.building.building_id}`;
    return (
    <Fragment>
        <InfoBox type='warning'>
            This section is under development as part of the project CLPV Tool. For more details and progress <a href="https://github.com/colouring-cities/manual/wiki/G.-Data-capture-methods">read here</a>.
        </InfoBox>
        <DataEntryGroup name="Planning application information" collapsed={false} >
            <DataEntryGroup name="Active applications (official data)" collapsed={false} >
                <PlanningDataOfficialDataEntry  
                    shownData={props.building.planning_data ? props.building.planning_data.filter(item => isArchived(item) == false) : []}
                    allEntryCount={props.building.planning_data ? props.building.planning_data.length : 0}
                />
            </DataEntryGroup>
            <DataEntryGroup name="Past applications (official data)" collapsed={true} >
                <InfoBox type='warning'>
                    Past applications, including those with no decision in over a year
                </InfoBox>
                <PlanningDataOfficialDataEntry  
                    shownData={props.building.planning_data ? props.building.planning_data.filter(item => isArchived(item)) : []}
                    allEntryCount={props.building.planning_data ? props.building.planning_data.length : 0}
            />
            </DataEntryGroup>
            <DataEntryGroup name="Crowdsourced info on planning applications" collapsed={true} >
                <CheckboxDataEntry
                        title="Has the work on this site been completed?"
                        slug="planning_live_application"
                        value={null}
                        disabled={false}
                        />
                    <NumericDataEntry
                        title={"Year of completion"}
                        slug="date_year"
                        value={2019}
                        mode={props.mode}
                        copy={props.copy}
                        onChange={props.onChange}
                        min={1}
                        max={currentYear}
                        // "type": "year_estimator"
                        />
            </DataEntryGroup>
        </DataEntryGroup>
        <DataEntryGroup name="Planning contraints and building protection" collapsed={true} >
            <DataEntryGroup name="Building protection" collapsed={false} >
                <NumericDataEntryWithFormattedLink
                    title={dataFields.planning_list_id.title}
                    slug="planning_list_id"
                    value={props.building.planning_list_id}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    placeholder="If yes, add ID here"
                    linkTargetFunction={(id: String) => { return "https://historicengland.org.uk/listing/the-list/list-entry/" + id + "?section=official-list-entry" } }
                    linkDescriptionFunction={(id: String) => { return "ID Link" } }
                />
                <Verification
                    slug="planning_list_id"
                    allow_verify={props.user !== undefined && props.building.planning_list_id !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_list_id")}
                    user_verified_as={props.user_verified.planning_list_id}
                    verified_count={props.building.verified.planning_list_id}
                    />
                <SelectDataEntry
                    title={dataFields.planning_list_grade.title}
                    slug="planning_list_grade"
                    value={props.building.planning_list_grade}
                    mode={props.mode}
                    disabled={false}
                    copy={props.copy}
                    onChange={props.onChange}
                    options={[
                        "I",
                        "II*",
                        "II",
                        "None"
                    ]}
                    />
                <Verification
                    slug="planning_list_grade"
                    allow_verify={props.user !== undefined && props.building.planning_list_grade !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_list_grade")}
                    user_verified_as={props.user_verified.planning_list_grade}
                    verified_count={props.building.verified.planning_list_grade}
                    />
                <DataEntry
                    title={dataFields.planning_heritage_at_risk_url.title}
                    slug="planning_heritage_at_risk_url"
                    value={props.building.planning_heritage_at_risk_url}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    placeholder="Please add relevant link here"
                    isUrl={true}
                    />
                <Verification
                    slug="planning_heritage_at_risk_url"
                    allow_verify={props.user !== undefined && props.building.planning_heritage_at_risk_url !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_heritage_at_risk_url")}
                    user_verified_as={props.user_verified.planning_heritage_at_risk_url}
                    verified_count={props.building.verified.planning_heritage_at_risk_url}
                    />
                <NumericDataEntryWithFormattedLink
                    title={dataFields.planning_world_list_id.title}
                    slug="planning_world_list_id"
                    value={props.building.planning_world_list_id}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    placeholder="If yes, add ID here"
                    linkTargetFunction={(id: String) => { return "https://whc.unesco.org/en/list/" + id } }
                    linkDescriptionFunction={(id: String) => { return "ID Link" } }
                    />
                <Verification
                    slug="planning_world_list_id"
                    allow_verify={props.user !== undefined && props.building.planning_world_list_id !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_world_list_id")}
                    user_verified_as={props.user_verified.planning_world_list_id}
                    verified_count={props.building.verified.planning_world_list_id}
                    />
                <DataEntry
                    title={dataFields.planning_local_list_url.title}
                    slug="planning_local_list_url"
                    value={props.building.planning_local_list_url}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    isUrl={true}
                    placeholder="Please add relevant link here"
                    />
                <Verification
                    slug="planning_local_list_url"
                    allow_verify={props.user !== undefined && props.building.planning_local_list_url !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_local_list_url")}
                    user_verified_as={props.user_verified.planning_local_list_url}
                    verified_count={props.building.verified.planning_local_list_url}
                    />
                <InfoBox msg="Designation data is currently incomplete. We are aiming for 100% coverage by April 2023." />
            </DataEntryGroup>
            <DataEntryGroup name="Area protection" collapsed={false} >
                <DataEntry
                    title={dataFields.planning_in_conservation_area_id.title}
                    slug="planning_in_conservation_area_id"
                    value={props.building.planning_in_conservation_area_id}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    placeholder="Please add Conservation Area identifier"
                    />
                <Verification
                    slug="planning_in_conservation_area_url"
                    allow_verify={props.user !== undefined && props.building.planning_in_conservation_area_url !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_in_conservation_area_url")}
                    user_verified_as={props.user_verified.planning_in_conservation_area_url}
                    verified_count={props.building.verified.planning_in_conservation_area_url}
                    />
                <DataEntry
                    title={dataFields.planning_in_conservation_area_url.title}
                    slug="planning_in_conservation_area_url"
                    value={props.building.planning_in_conservation_area_url}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    isUrl={true}
                    placeholder="Please add CA appraisal link here"
                    />
                <DataEntry
                    title={dataFields.planning_conservation_area_name.title}
                    slug="planning_conservation_area_name"
                    value={props.building.planning_conservation_area_name}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    />
                <Verification
                    slug="planning_conservation_area_name"
                    allow_verify={props.user !== undefined && props.building.planning_conservation_area_name !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_conservation_area_name")}
                    user_verified_as={props.user_verified.planning_conservation_area_name}
                    verified_count={props.building.verified.planning_conservation_area_name}
                    />
                <DataEntry
                    title={dataFields.planning_historic_area_assessment_url.title}
                    slug="planning_historic_area_assessment_url"
                    value={props.building.planning_historic_area_assessment_url}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    isUrl={true}
                    placeholder="Please add relevant link here"
                    />
                <Verification
                    slug="planning_historic_area_assessment_url"
                    allow_verify={props.user !== undefined && props.building.planning_historic_area_assessment_url !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_historic_area_assessment_url")}
                    user_verified_as={props.user_verified.planning_historic_area_assessment_url}
                    verified_count={props.building.verified.planning_historic_area_assessment_url}
                    />
                <DataEntry
                    title={dataFields.planning_in_apa_url.title}
                    slug="planning_in_apa_url"
                    value={props.building.planning_in_apa_url}
                    mode={props.mode}
                    copy={props.copy}
                    onChange={props.onChange}
                    isUrl={true}
                    placeholder="Please add relevant link here"
                    />
                <Verification
                    slug="planning_in_apa_url"
                    allow_verify={props.user !== undefined && props.building.planning_in_apa_url !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("planning_in_apa_url")}
                    user_verified_as={props.user_verified.planning_in_apa_url}
                    verified_count={props.building.verified.planning_in_apa_url}
                    />
            </DataEntryGroup>
        </DataEntryGroup>
        <DataEntryGroup name="Other types of zoning" collapsed={true} >
            <CheckboxDataEntry
            title="Is the building inside a flood zone?"
            slug="planning_live_application"
            value={null}
            disabled={true}
            />
            <Verification
                slug="dummy"
                allow_verify={false}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("dummy")}
                user_verified_as={props.user_verified.planning_in_apa_url}
                verified_count={props.building.verified.planning_in_apa_url}
            />
            <CheckboxDataEntry
            title="Is the building in a strategic development zone for housing?"
            slug="planning_live_application"
            value={null}
            disabled={true}
            />
            <Verification
                slug="dummy"
                allow_verify={false}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("dummy")}
                user_verified_as={props.user_verified.planning_in_apa_url}
                verified_count={props.building.verified.planning_in_apa_url}
            />
            <CheckboxDataEntry
            title="Is the building in a strategic development zone for commerce or industry?"
            slug="planning_live_application"
            value={null}
            disabled={true}
            />
            <Verification
                slug="dummy"
                allow_verify={false}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("dummy")}
                user_verified_as={props.user_verified.planning_in_apa_url}
                verified_count={props.building.verified.planning_in_apa_url}
            />
            <CheckboxDataEntry
            title="Is the building within a protected sightline?"
            slug="planning_live_application"
            value={null}
            disabled={true}
            />
            <Verification
                slug="dummy"
                allow_verify={false}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("dummy")}
                user_verified_as={props.user_verified.planning_in_apa_url}
                verified_count={props.building.verified.planning_in_apa_url}
            />
            {/*
                <DataEntry
                title={dataFields.planning_glher_url.title}
                slug="planning_glher_url"
                value={props.building.planning_glher_url}
                mode={props.mode}
                copy={props.copy}
                onChange={props.onChange}
                isUrl={true}
                placeholder="Please add relevant link here"
                />
            <Verification
                slug="planning_glher_url"
                allow_verify={props.user !== undefined && props.building.planning_glher_url !== null && !props.edited}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("planning_glher_url")}
                user_verified_as={props.user_verified.planning_glher_url}
                verified_count={props.building.verified.planning_glher_url}
                />
            */}
        </DataEntryGroup>
        <DataEntryGroup name="Land parcel ownership" collapsed={true} >
                <SelectDataEntry
                    slug='community_public_ownership'
                    title={"What type of owner owns this land parcel? "}
                    value={props.building.community_public_ownership}
                    options={[
                        'Government-owned',
                        'Charity-owned',
                        'Community-owned/cooperative',
                        'Owned by other non-profit body',
                        'Not in public/community ownership',
                    ]}

                    onChange={props.onChange}
                    mode={props.mode}
                    copy={props.copy}
                />
                <Verification
                    slug="community_public_ownership"
                    allow_verify={props.user !== undefined && props.building.community_public_ownership !== null && !props.edited}
                    onVerify={props.onVerify}
                    user_verified={props.user_verified.hasOwnProperty("community_public_ownership")}
                    user_verified_as={props.user_verified.community_public_ownership}
                    verified_count={props.building.verified.community_public_ownership}
                />
        </DataEntryGroup>
    </Fragment>
)};
const PlanningContainer = withCopyEdit(PlanningView);

export default PlanningContainer;
