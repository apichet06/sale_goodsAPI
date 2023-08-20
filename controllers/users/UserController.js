const User = require('../../models/users/UserModels');
const FileHelper = require('../../models/fileuploads/fileModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv');
require('../../message/message');
const fs = require('fs');


class UserController {

    static async createUser(req, res) {
        try {
            const { u_name, u_lastname, u_email, u_password } = req.body;
            const file = req.file;
            const folder = 'profile';
            // console.log(file);

            // Check for duplicate email
            const existingUser = await User.findByEmail(u_email);
            if (existingUser) {
                // เมื่อมี email ซำให้ทำการหยุด uploadfileimage
                file && fs.unlinkSync(file.path);
                return res.status(409).json({ error: repeat_email });
            }
            // Generate auto ID

            const u_id = await User.generateUniqueId();
            const filePath = file ? await FileHelper.uploadFile(file, u_id, folder) : '';


            // Hash the password
            const hashedPassword = await bcrypt.hash(u_password, 10);
            const userData = {
                u_id,
                u_name,
                u_lastname,
                u_email,
                u_password: hashedPassword,
                u_profileimage: filePath
            };

            const user = await User.create(userData);
            // Exclude u_password from the response 
            const { u_password: password, ...data } = user
            res.status(200).json({ status: 'ok', data });

        } catch (error) {

            console.error(error.sqlMessage);
            res.status(500).json({ status: error500, message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { u_name, u_lastname, u_email, u_password } = req.body;
            const { u_id } = req.params;
            const file = req.file;
            const folder = 'profile';
            const chackUserId = await User.getUserById(u_id);
            if (!chackUserId) {
                file && fs.unlinkSync(file.path);
                return res.status(409).json({ message: ID_not_found })

            }

            // Check for duplicate email
            const existingUser = await User.findupdateByEmail(u_email, u_id);
            if (existingUser) {
                // เมื่อมี email ซำให้ทำการหยุด uploadfileimage
                file && fs.unlinkSync(file.path);
                return res.status(409).json({ error: repeat_email });
            }
            const filePath = file ? await FileHelper.uploadFile(file, u_id, folder) : '';
            // console.log(filePath);

            // Hash the password
            const hashedPassword = await bcrypt.hash(u_password, 10);
            const userData = {
                u_name,
                u_lastname,
                u_email,
                u_password: hashedPassword,
                u_profileimage: filePath
            };
            const updatedUser = await User.update(userData, u_id)

            if (updatedUser > 0) {
                const user = await User.getUserById(u_id);
                const { u_password, ...data } = user
                res.status(200).json({ status: 'ok', message: updatsesuccess, user: data })
            }
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message })
        }


    }

    static async deleteUser(req, res) {
        try {
            const { u_id } = req.params;
            const chackUserId = await User.getUserById(u_id);
            if (!chackUserId) {
                return res.status(409).json({ message: ID_not_found })

            }


            const user = await User.getUserById(u_id);


            if (user) {
                let dataunlink;
                fs.unlink(user.u_profileimage, (err) => (err ? dataunlink = (dataunlinkError, err) : dataunlink = (dataunlinksuccess)));

                await User.delete(u_id);
                const { u_password, ...data } = user
                res.status(200).json({ status: 'ok', delimage: dataunlink, message: deletesuccess, user: data })

            }

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message })
        }



    }



    static async UserAll(req, res, next) {

        try {

            const users = await User.usersAll();
            if (users) {
                res.status(200).json({ status: 'ok', data: users })
            }

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message })
        }

    }


    static async login(req, res) {
        const { u_email, u_password } = req.body;

        console.log(u_email);
        try {
            // Find user by email
            const user = await User.findByEmail(u_email);

            if (!user) {
                return res.status(404).json({ error: User_not_found });
            }

            // Compare passwords
            const passwordMatch = await User.comparePasswords(u_password, user.u_password);
            console.log(passwordMatch);
            if (!passwordMatch) {
                return res.status(401).json({ error: Invalid_password });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.u_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            delete user.u_password
            // Return the token
            res.json({ success: true, token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error500, message: error.message });
        }
    }

}

module.exports = UserController;