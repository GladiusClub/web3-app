import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

function MemberRow({ member, onToPayChange, toPayStatus, paymentStatus }) {
  const payout =
    member.score && member.coefficient ? member.score * member.coefficient : 0;

  const [toPay, setToPay] = useState(() => {
    if (payout === 0) {
      return false;
    }
    return toPayStatus !== undefined ? toPayStatus : !member.paid;
  });

  useEffect(() => {
    if (payout !== 0) {
      setToPay(toPayStatus !== undefined ? toPayStatus : !member.paid);
    }
  }, [toPayStatus, member.paid, payout]);

  const handleLocalToPayChange = (event) => {
    const newToPayStatus = event.target.checked;
    setToPay(newToPayStatus);
    onToPayChange(member.id, newToPayStatus); // calling the prop function here
  };

  const isDisabled = Boolean(member.paid) || payout === 0;

  return (
    <TableRow key={member.id}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        {member.paid ? new Date(member.paid).toLocaleDateString() : "Not Paid"}
      </TableCell>
      <TableCell>{payout}</TableCell>
      <TableCell>
        <Checkbox
          checked={toPay}
          onChange={handleLocalToPayChange}
          disabled={isDisabled}
        />
      </TableCell>
      <TableCell>
        {paymentStatus === PaymentStatus.IN_PROGRESS ? (
          <CircularProgress size={20} />
        ) : paymentStatus === PaymentStatus.SUCCESS ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          paymentStatus
        )}
      </TableCell>
    </TableRow>
  );
}

const PaymentStatus = {
  PENDING: "payment pending",
  IN_PROGRESS: "payment in progress",
  FAILED: "payment failed",
  SUCCESS: "payment success",
};

function PaymentTable({
  memberDetails,
  handlePaymentMembers,
  membersToPay,
  setMembersToPay,
}) {
  const handleToPayChange = (memberId, toPay) => {
    setMembersToPay((prevState) => ({
      ...prevState,
      [memberId]: {
        ...prevState[memberId],
        toPay,
        status: PaymentStatus.PENDING,
      },
    }));
  };

  const updatePaymentStatus = (memberId, status) => {
    if (!Object.values(PaymentStatus).includes(status)) {
      throw new Error(`Invalid payment status: ${status}`);
    }

    setMembersToPay((prevState) => ({
      ...prevState,
      [memberId]: {
        ...prevState[memberId],
        status,
      },
    }));
  };

  useEffect(() => {
    handlePaymentMembers(membersToPay);
  }, [membersToPay, handlePaymentMembers]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Member</TableCell>
          <TableCell>Paid On</TableCell>
          <TableCell>Payout</TableCell>
          <TableCell>Pay</TableCell>
          <TableCell>Transaction Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {memberDetails
          .filter((member) => member.attended === true)
          .map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onToPayChange={handleToPayChange}
              toPayStatus={membersToPay[member.id]?.toPay}
              paymentStatus={membersToPay[member.id]?.status}
            />
          ))}
      </TableBody>
    </Table>
  );
}

export default PaymentTable;
