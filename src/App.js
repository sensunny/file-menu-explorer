import React, { useState } from "react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";

const App = () => {
	const [files] = useState([
		{
			name: "File 1",
			type: "file",
			id: 1,
		},
		{
			id: 2,
			name: "Folder 1",
			type: "folder",
			children: [
				{
					id: 21,
					name: "File 2",
					type: "file",
				},
				{
					id: 22,
					name: "Folder 2",
					type: "folder",
					children: [
						{
							id: 221,
							name: "File 3",
							type: "file",
						},
						{
							id: 222,
							name: "Folder 3",
							type: "folder",
						},
					],
				},
			],
		},
		{
			id: 3,
			name: "Folder 3",
			type: "folder",
			children: [
				{
					id: 31,
					name: "File 2",
					type: "file",
				},
				{
					id: 32,
					name: "Folder 2",
					type: "folder",
					children: [
						{
							id: 321,
							name: "File 3",
							type: "file",
						},
						{
							id: 322,
							name: "Folder 3",
							type: "folder",
						},
					],
				},
			],
		},
	]);

	const RecursiveRenderFile = ({ fileSys, parentNode = false }) => {
		const [files, setFiles] = useState(fileSys);
		const [expandIndexs, setExpand] = useState({});
		const [onEdit, setEdit] = useState({});
		const [showIconLayers, setIsShown] = useState({});
		const [showError, setError] = useState(null);
		let handleClick = (e, i) => {
			setExpand(() => {
				return {
					...expandIndexs,
					[i]: !expandIndexs[i],
				};
			});
		};
		const handleDelete = (file) => {
			let tfiles = files.filter((f) => f.id !== file.id);
			setFiles(tfiles);
		};
		let handleKeyDown = (e, i) => {
			if (e.key === "Enter") {
				files[i].name = e.target.value;
				if (!e.target.value.trim()) {
					setError("Name Should Not be empty!");
					return;
				}
				delete files[i].editName;
				setFiles(files);
				setEdit({});
				setError(null);
			}
		};
		let handleRename = (i) => {
			setEdit({
				[i]: true,
			});
		};

		let handleAdd = (index, type) => {
			files[index] = {
				...files[index],
			};
			let emptyOneChildren = {
				type,
				id: Date.now(),
				children: null,
			};
			if (files[index].children) {
				files[index].children = [...files[index].children];
			} else {
				files[index].children = [];
			}
			// temp name should be unique
			let { children } = files[index];
			let i = 0;
			let newFileName = "New " + type;
			let newName = newFileName;
			children &&
				children.forEach((item) => {
					let { name } = item;
					if (name === newName) {
						newName = newFileName + " " + (i + 1);
						i = i + 1;
					}
				});
			emptyOneChildren = {
				...emptyOneChildren,
				name: newName,
			};
			files[index].children.push(emptyOneChildren);
			setFiles(files);
			setExpand(() => {
				return {
					...expandIndexs,
					[index]: false,
				};
			});
			setTimeout(() => {
				setExpand(() => {
					return {
						...expandIndexs,
						[index]: true,
					};
				});
			}, 0);
		};
		let handleFreshAdd = (type) => {
			let emptyOneChildren = {
				type,
				id: Date.now(),
				children: null,
				name: "New " + type + " " + (files.length + 1),
			};
			files.push(emptyOneChildren);
			console.log({ files });
			setFiles(() => {
				return [...files];
			});
		};
		return (
			<ul className={parentNode ? "parent-node" : ""}>
				{parentNode ? (
					<Stack
						direction="row"
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
						<Tooltip title="Add File">
							<IconButton
								onClick={(e) => handleFreshAdd("folder")}
								size="small"
							>
								<FolderIcon sx={{ fontSize: "100px" }} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Add File">
							<IconButton
								onClick={(e) => handleFreshAdd("file")}
								size="small"
							>
								<InsertDriveFileIcon
									sx={{ fontSize: "100px" }}
								/>
							</IconButton>
						</Tooltip>
					</Stack>
				) : null}
				{files.map((file, i) => {
					return (
						<li key={file.id}>
							<Stack
								onMouseOver={(e) => {
									e.stopPropagation();
									setIsShown({ [i]: true });
								}}
								onMouseLeave={() => {
									setIsShown({});
								}}
								direction="row"
								spacing={0}
							>
								{onEdit[i] || file.editName ? (
									<TextField
										error={!!showError}
										helperText={showError}
										id="outlined-basic"
										onKeyDown={(e) => handleKeyDown(e, i)}
										defaultValue={file.name}
										label="Name"
										variant="outlined"
									/>
								) : (
									<>
										<Button
											size="small"
											onClick={(e) => handleClick(e, i)}
											variant=""
											endIcon={
												file.children ? (
													expandIndexs[i] ? (
														<ExpandLessIcon />
													) : (
														<ExpandMoreIcon />
													)
												) : null
											}
											startIcon={
												file.type === "folder" ? (
													expandIndexs[i] ? (
														<FolderOpenIcon />
													) : (
														<FolderIcon />
													)
												) : (
													<InsertDriveFileIcon />
												)
											}
										>
											{file.name}
										</Button>
										{file.type !== "file" ? (
											<>
												<Tooltip title="Rename">
													<IconButton
														size="small"
														style={
															showIconLayers[i]
																? {
																		visibility:
																			"unset",
																  }
																: {
																		visibility:
																			"hidden",
																  }
														}
														onClick={(e) =>
															handleRename(i)
														}
														variant=""
													>
														<EditIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title="Add File">
													<IconButton
														size="small"
														style={
															showIconLayers[i]
																? {
																		visibility:
																			"unset",
																  }
																: {
																		visibility:
																			"hidden",
																  }
														}
														onClick={(e) =>
															handleAdd(i, "file")
														}
														variant=""
													>
														<InsertDriveFileIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title="Add Folder">
													<IconButton
														size="small"
														style={
															showIconLayers[i]
																? {
																		visibility:
																			"unset",
																  }
																: {
																		visibility:
																			"hidden",
																  }
														}
														onClick={(e) =>
															handleAdd(
																i,
																"folder"
															)
														}
														variant=""
													>
														<FolderIcon />
													</IconButton>
												</Tooltip>
											</>
										) : null}
										<Tooltip title="Delete">
											<IconButton
												style={
													showIconLayers[i]
														? {
																visibility:
																	"unset",
														  }
														: {
																visibility:
																	"hidden",
														  }
												}
												onClick={(e) =>
													handleDelete(file)
												}
											>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</>
								)}
							</Stack>
							{file.children &&
							file.children.length &&
							expandIndexs[i] ? (
								<RecursiveRenderFile
									parentNode={false}
									fileSys={file.children}
								/>
							) : null}
						</li>
					);
				})}
			</ul>
		);
	};
	return (
		<div>
			<CardHeader
				style={{ textAlign: "center" }}
				title="File Menu Explorer"
			/>
			<RecursiveRenderFile parentNode={true} fileSys={files} />
		</div>
	);
};

export default App;
