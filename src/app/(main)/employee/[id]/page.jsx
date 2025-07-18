"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Tabs,
    Tab,
} from "@mui/material";
import {
    Person,
    Email,
    Phone,
    Cake,
    Transgender,
    Home,
    Work,
    AccountBalance,
    Code,
    Groups,
    School,
    Event,
    Paid,
} from "@mui/icons-material";
import { getEmployeeByIdApi } from "@/api";

const UserProfile = ({ params }) => {

    const empld = params?.id;
    const [tabValue, setTabValue] = useState(0);
    const [userData, setUserData] = useState([]);

    const handleFetchEmployeeDetails = async () => {
        try {
            const response = await getEmployeeByIdApi(empld);
            if (response && response?.data) {
                setUserData(response?.data?.data)
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const personalInfoItems = [
        {
            icon: <Email />,
            primary: "Email",
            secondary: (
                <>
                    {userData?.email}
                    <br />
                    {userData?.personalEmail}
                </>
            ),
        },
        {
            icon: <Phone />,
            primary: "Phone",
            secondary: (
                <>
                    {userData?.userDetails?.phoneNumber}
                    <br />
                    {userData?.userDetails?.personalNumber}
                </>
            ),
        },
        {
            icon: <Cake />,
            primary: "Date of Birth",
            secondary: formatDate(userData.userDetails?.dateOfBirth),
        },
        {
            icon: <Transgender />,
            primary: "Gender",
            secondary: userData?.userDetails?.gender,
        },
    ];

    useEffect(() => {
        handleFetchEmployeeDetails();
    }, [empld]);

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item size={{ xs: 12, md: 3 }}>
                        <Avatar
                            src={userData?.image}
                            sx={{ width: 150, height: 150, mx: "auto" }}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 9 }}>
                        <Typography variant="h4">
                            {userData?.firstName} {userData?.lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {userData?.userDetails?.designation?.label} • {userData?.employeeId}
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                            {userData?.userDetails?.team?.label && <Chip
                                icon={<Groups />}
                                label={userData?.userDetails?.team?.label}
                                color="primary"
                                variant="outlined"
                            />}
                            {userData?.userDetails?.department?.label && <Chip
                                icon={<Work />}
                                label={userData?.userDetails?.department?.label}
                                color="secondary"
                                variant="outlined"
                            />}

                            {userData?.roleDetails?.role && <Chip
                                label={userData?.roleDetails?.role.replace("_", " ")}
                                color="info"
                                variant="outlined"
                            />}
                            {userData?.isActive &&
                                <Chip
                                    label={userData?.isActive ? "Active" : "Inactive"}
                                    color={userData?.isActive ? "success" : "error"}
                                    variant="outlined"
                                />}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Personal Information" />
                <Tab label="Professional Details" />
                <Tab label="Skills" />
                <Tab label="Bank & Salary" />
            </Tabs>

            {tabValue === 0 && (
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader title="Basic Information" />
                            <CardContent>
                                <List>
                                    {personalInfoItems.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>{item.icon}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={item.primary} secondary={item.secondary} />
                                            </ListItem>
                                            {index < personalInfoItems.length - 1 && (
                                                <Divider variant="inset" component="li" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <Home />
                                    </Avatar>
                                }
                                title="Address Information"
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Permanent Address
                                </Typography>
                                <Typography paragraph>
                                    {userData?.userDetails?.permenentAddress?.street}
                                    <br />
                                    {userData?.userDetails?.permenentAddress?.city},{" "}
                                    {userData?.userDetails?.permenentAddress?.state}
                                    <br />
                                    {userData?.userDetails?.permenentAddress?.country} -{" "}
                                    {userData?.userDetails?.permenentAddress?.zip}
                                </Typography>

                                <Typography variant="h6" gutterBottom>
                                    Current Address
                                </Typography>
                                <Typography paragraph>
                                    {userData?.userDetails?.currentAddress?.street}
                                    <br />
                                    {userData?.userDetails?.currentAddress?.city},{" "}
                                    {userData?.userDetails?.currentAddress?.state}
                                    <br />
                                    {userData?.userDetails?.currentAddress?.country} -{" "}
                                    {userData?.userDetails?.currentAddress?.zip}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader title="Employment Details" />
                            <CardContent>
                                <List>
                                    {[
                                        {
                                            primary: "Joining Date",
                                            secondary: formatDate(userData?.userDetails?.joiningDate),
                                        },
                                        {
                                            primary: "Probation Date",
                                            secondary: formatDate(userData?.userDetails?.probationDate),
                                        },
                                        {
                                            primary: "Previous Experience",
                                            secondary: `${userData?.userDetails?.previousExperience} years`,
                                        },
                                        {
                                            primary: "PAN Number",
                                            secondary: userData?.userDetails?.panNo ?? "-",
                                        },
                                        {
                                            primary: "PF Number",
                                            secondary: userData?.userDetails?.pfNo || "-",
                                        },
                                        {
                                            primary: "UAN Detail",
                                            secondary: userData?.userDetails?.uanDetail || "-",
                                        },
                                    ].map((item, index, array) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={item?.primary}
                                                    secondary={item?.secondary}
                                                />
                                            </ListItem>
                                            {index < array.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader title="Department & Team" />
                            <CardContent>
                                <List>
                                    {[
                                        {
                                            primary: "Department",
                                            secondary: userData?.userDetails?.department?.label ?? "-",
                                        },
                                        {
                                            primary: "Designation",
                                            secondary: userData?.userDetails?.designation?.label ?? "-",
                                        },
                                        {
                                            primary: "Team",
                                            secondary: userData?.userDetails?.team?.label ?? "-",
                                        },
                                    ].map((item, index, array) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={item?.primary}
                                                    secondary={item?.secondary}
                                                />
                                            </ListItem>
                                            {index < array.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 2 && (
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <Code />
                                    </Avatar>
                                }
                                title="Primary Skills"
                            />
                            <CardContent>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {userData?.userDetails?.primarySkills?.map((skill) => (
                                        <Chip
                                            key={skill?._id}
                                            label={skill?.label}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <School />
                                    </Avatar>
                                }
                                title="Secondary Skills"
                            />
                            <CardContent>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {userData.userDetails?.secondarySkills?.map((skill) => (
                                        <Chip
                                            key={skill?._id}
                                            label={skill?.label}
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 3 && (
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <Paid />
                                    </Avatar>
                                }
                                title="Salary Information"
                            />
                            <CardContent>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Current Salary"
                                            secondary={
                                                userData?.userDetails?.currentSalary
                                                    ? `₹${userData.userDetails.currentSalary.toLocaleString("en-IN")}`
                                                    : "-"
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <AccountBalance />
                                    </Avatar>
                                }
                                title="Bank Details"
                            />
                            <CardContent>
                                <List>
                                    {[
                                        {
                                            primary: "Account Number",
                                            secondary: userData?.userDetails?.bankDetails?.accountNumber || "-",
                                        },
                                        {
                                            primary: "IFSC Code",
                                            secondary: userData?.userDetails?.bankDetails?.ifscCode || "-",
                                        },
                                        {
                                            primary: "Branch Name",
                                            secondary: userData?.userDetails?.bankDetails?.branchName || "-",
                                        },
                                    ].map((item, index, array) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText primary={item?.primary} secondary={item?.secondary} />
                                            </ListItem>
                                            {index < array.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default UserProfile;