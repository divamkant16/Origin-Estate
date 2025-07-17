import express from 'express';
import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working!'
    });
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can only update your own account!")); 
    }
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10); // hash the password so that if it is compromised, it is not in plain text
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                image: req.body.image
            }
        }, { new: true});

        const { password, ...rest } = updatedUser._doc; // exclude password from response

        res.status(200).json(rest)
    } catch(error) {
        next(error);
    }
    
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can only delete your own account!")); 
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token", { httpOnly: true }); // clearing the cookie after deleting the user - must match the options used when setting
        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch(error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can only view your own listings!")); 
    }
    try {
        console.log('Getting listings for user:', req.params.id);
        const listings = await Listing.find({userRef: req.params.id});
        console.log('Found listings:', listings.length);
        res.status(200).json(listings);
    } catch(error) {
        console.error('Error in getUserListings:', error);
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user)
            return next(errorHandler(404, "User not found!"));
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
    
}